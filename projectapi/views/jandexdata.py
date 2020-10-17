from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from projectapi.models import Project, WebPage, Employee, ProjectEmployeeConnection, Goal
from projectapi.serializers import ProjectSerializer, EmployeeSerializer

import logging
import json
import concurrent.futures
import os
import requests

logging.basicConfig(level=logging.INFO)

METRIC_TOKEN = os.environ.get('METRIC_TOKEN')
HEADERS = {"Authorization": f"OAuth {METRIC_TOKEN}"}
JANDEX_STAT = "https://api-metrika.yandex.net/stat/v1/data?"
JANDEX_STAT_BY_TIME = "https://api-metrika.yandex.net/stat/v1/data/bytime?"

""" Вспомогательная функция для thread
    Используется для отправки http запроса и его обработки
"""

def fetch(url):
    try:
        response = requests.get(url, headers = HEADERS)
        return response.json()
    except Exception as e:
        print(e)
        return None



""" Возвращает данные по числу завершения целей в формате JSON после Яндекс Метрики
    Аргументы, передаваемые в теле запроса:
    - date1 - дата начала периода, за который осуществляется запрос
    - date2 - дата конца периода, за который осуществляется запрос
    - traffic_source - источник траффика (необязательный, возможно список //check)
    - jandexid - id проекта в Яндекс Метрике
    Используетя модуль threading
"""

@csrf_exempt
def goals_reaches_view(request):
    print(request.path)
    if request.method == 'POST':
        logging.warning(f'[Threads goals reaches request] POST')
        filter_string = ''
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')
        traffic_source = request_body.get('traffic_source')
        curr_goal_id = request_body.get('curr_goal_id') ## Used for getting info by time

        if traffic_source and traffic_source != 'all':
            logging.warning(f'[Threads goals reaches request] traffic source provided')
            filter_string = f"&filters=ym:s:<attribution>TrafficSource=.('{traffic_source}')"

        ## В случае запроса по всем целям
        ## Возвращается число выполнений каждой цели
        ## в зависимости от периода времени и источника трафика
        if request.path == '/api/jandexdata/goals/reaches':
            with concurrent.futures.ThreadPoolExecutor() as executor:
                goals_ids = [goal.jandexid for goal in Goal.objects.filter(project__jandexid = jandexid)]
                urls = [(f"{JANDEX_STAT}id={jandexid}&metrics=ym:s:goal{goal_id}reaches&date1={date1}&date2={date2}\
&dimensions=ym:s:<attribution>TrafficSource" + filter_string) for goal_id in goals_ids]
                result = list(executor.map(fetch, urls))
                print([res.get('totals') for res in result])
                logging.warning(f'[Threads goals reaches request] returning requested data')
                return JsonResponse(result, safe = False)

        ## В случае запроса по времени запрос идет по конкретной цели (curr_goal_id)
        ## Возвращается число выполнений данной цели в конкретный день
        ## Для построения графика требуется  аггрегация данных
        else:
            url = f"{JANDEX_STAT_BY_TIME}id={jandexid}&group=day&metrics=ym:s:goal{curr_goal_id}reaches&date1={date1}&date2={date2}\
&dimensions=ym:s:<attribution>TrafficSource" + filter_string
            result = fetch(url)
            print(result)
            logging.warning(f'[Threads goals reaches bytime request] returning requested data')
            return JsonResponse(result, safe = False)



""" 
Перешли на сайт
3924
5293
- 25.86%
Добавление в корзину (unique)
20
24
- 16.67%
Добавлено в корзину
-1183
-145
- -715.86%
Заказы
23
31
- 25.81%
Общая сумма заказов
486400
952470
- 48.93%
Средний чек
21147.83
30724.84
- 31.17%
"""
