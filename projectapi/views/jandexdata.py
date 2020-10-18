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
import math

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


""" Вспомогательная функция для разделения массива на массивы по number элементов
"""
def array_split(arr, num):
    length = len(arr)
    result = []
    if length > num:
        count = math.ceil(length/num)
        n = 0
        while n < count-1:
            result.append(arr[num*n:num*(n+1)])
            n+=1
        result.append(arr[num*n:])
        return result
    return [arr]



""" Возвращает данные по числу завершения целей в формате JSON после Яндекс Метрики
    Аргументы, передаваемые в теле запроса:
    - date1 - дата начала периода, за который осуществляется запрос
    - date2 - дата конца периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
    - curr_goal_id - id цели (лида) в Яндекс Метрике (если запрос осуществляется по времени //month //day)
    Используетя модуль threading
"""

@csrf_exempt
def goals_reaches_view(request):

    if request.method == 'POST':
        logging.warning(f'[Threads goals reaches request] POST')
        filter_string = ''
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')
        curr_goal_id = request_body.get('curr_goal_id') ## Used for getting info by time

        ## В случае запроса по всем целям
        ## Возвращается число выполнений каждой цели
        ## в зависимости от периода времени и источника трафика
        ## max_number определяет максимальное число метрик в запросе (согласно Яндекс Метрики - 20)
        max_number = 15
        if request.path == '/api/jandexdata/goals/reaches':
            goals_ids = [('ym:s:goal'+str(goal.jandexid)+ 'reaches') for goal in 
                Goal.objects.filter(project__jandexid = jandexid).filter(active = True)]
            goals_splitted = array_split(goals_ids, max_number)
            goals_strings = [','.join(goals_id) for goals_id in goals_splitted]
            with concurrent.futures.ThreadPoolExecutor() as executor:
                urls = [(f"{JANDEX_STAT}id={jandexid}&metrics={goals_string}&date1={date1}&date2={date2}\
&dimensions=ym:s:<attribution>TrafficSource") for goals_string in goals_strings]
                result = list(executor.map(fetch, urls))
                logging.warning(f'[Threads goals reaches request] returning requested data')
                return JsonResponse(result, safe = False)

        ## В случае запроса по времени запрос идет по конкретной цели (curr_goal_id)
        ## Возвращается число выполнений данной цели в конкретный день
        ## Для построения графика требуется  аггрегация данных
        elif request.path == '/api/jandexdata/goals/reaches/month':
            url = f"{JANDEX_STAT_BY_TIME}id={jandexid}&group=month&metrics=ym:s:goal{curr_goal_id}reaches&date1={date1}&date2={date2}\
&dimensions=ym:s:<attribution>TrafficSource"
            result = fetch(url)
            logging.warning(f'[Threads goals reaches by month request] returning requested data')
            return JsonResponse(result, safe = False)

        elif request.path == '/api/jandexdata/goals/reaches/day':
            url = f"{JANDEX_STAT_BY_TIME}id={jandexid}&group=day&metrics=ym:s:goal{curr_goal_id}reaches&date1={date1}&date2={date2}\
&dimensions=ym:s:<attribution>TrafficSource"
            result = fetch(url)
            logging.warning(f'[Threads goals reaches by day request] returning requested data')
            return JsonResponse(result, safe = False)


""" Возвращает общие данные по числу визитов, среднему доходу, доходу с посещения ...
    Аргументы, передаваемые в теле запроса:
    - date1 - дата начала периода, за который осуществляется запрос
    - date2 - дата конца периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def tasks_general_view(request):

    if request.method == 'POST':
        logging.warning(f'[Tasks general info] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')

        url = f"{JANDEX_STAT}id={jandexid}&metrics=ym:s:visits&metrics=ym:s:productBasketsUniq\
&metrics=ym:s:productBasketsQuantity&metrics=ym:s:ecommercePurchases&metrics=ym:s:ecommerceRevenue\
&metrics=ym:s:ecommerceRevenuePerPurchase&date1={date1}&date2={date2}\
&dimensions=ym:s:<attribution>TrafficSource"
        result = fetch(url)
        logging.warning(f'[Threads goals reaches by month request] returning requested data')
        return JsonResponse(result, safe = False)


""" Возвращает общие данные по числу визитов, среднему доходу, доходу с посещения ...
    Аргументы, передаваемые в теле запроса:
    - date1 - дата начала периода, за который осуществляется запрос
    - date2 - дата конца периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def tasks_year_view(request):

    if request.method == 'POST':
        logging.warning(f'[Tasks general info] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')

        url = f"{JANDEX_STAT_BY_TIME}id={jandexid}&metrics=ym:s:ecommercePurchases&metrics=ym:s:ecommerceRevenue\
&metrics=ym:s:ecommerceRevenuePerPurchase&date1={date1}&date2={date2}&group=month\
&dimensions=ym:s:<attribution>TrafficSource"
        result = fetch(url)
        logging.warning(f'[Threads goals reaches by month request] returning requested data')
        return JsonResponse(result, safe = False)

