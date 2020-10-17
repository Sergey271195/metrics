from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from projectapi.models import Project, WebPage, Employee, ProjectEmployeeConnection
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

    if request.method == 'POST':
        logging.info(f'[Threads goals request] POST')
        request_body = json.loads(request.body)
        jandexid = request_body.get('jandexid')
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')
        traffic_source = request_body.get('traffic_source')
        if traffic_source:
            logging.info(f'[Threads goals request] traffic source provided')
            filter_string = f"&filters=ym:s:<attribution>TrafficSource=.('{traffic_source}')"
        else:
            filter_string = ''
        with concurrent.futures.ThreadPoolExecutor() as executor:
                array = [100047235, 100047211, 100047355]
                urls = [(f"{JANDEX_STAT}id={jandexid}&metrics=ym:s:goal{goal_id}reaches&date1={date1}&date2={date2}\
&dimensions=ym:s:<attribution>TrafficSource" + filter_string) for goal_id in array]
                result = list(executor.map(fetch, urls))
                for response in result:
                    print('--------')
                    print(response.get('data'))
                logging.info(f'[Threads goals request] returning requested data')
                return JsonResponse(result, safe = False)
