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
JANDEX_STAT_COMPARE = "https://api-metrika.yandex.net/stat/v1/data/comparison?"
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
def all_goals_reaches_view(request):

    if request.method == 'POST':
        logging.warning(f'[Threads goals reaches request] POST')
        filter_string = ''
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')
        curr_goal_id = request_body.get('curr_goal_id') ## Used for getting info by time


        ## Если требются данные по всем целям сразу
        max_number = 15
        goals_ids = [('ym:s:goal'+str(goal.jandexid)+ 'reaches') for goal in 
            Goal.objects.filter(project__jandexid = jandexid).filter(active = True)]
        goals_splitted = array_split(goals_ids, max_number)
        goals_strings = [','.join(goals_id) for goals_id in goals_splitted]

        jandex_path = JANDEX_STAT
        group_path = ''
        
        ## В случае запроса по всем целям
        ## Возвращается число выполнений каждой цели
        ## в зависимости от периода времени и источника трафика
        ## max_number определяет максимальное число метрик в запросе (согласно Яндекс Метрики - 20)
        if request.path == '/api/jandexdata/goals/reaches/day/all':
            jandex_path = JANDEX_STAT_BY_TIME
            group_path ='&group=day'

        elif request.path == '/api/jandexdata/goals/reaches/month/all':
            jandex_path = JANDEX_STAT_BY_TIME
            group_path ='&group=month'

        with concurrent.futures.ThreadPoolExecutor() as executor:
            urls = [(f"{jandex_path}id={jandexid}{group_path}&metrics={goals_string}&date1={date1}&date2={date2}\
&dimensions=ym:s:<attribution>TrafficSource") for goals_string in goals_strings]
            result = list(executor.map(fetch, urls))
            logging.warning(f'[Threads goals reaches request] returning requested data')
            return JsonResponse(result, safe = False)



""" Возвращает общие данные по числу заказов, число товаров в корзине, среднему доходу, доходу с посещения ...
    Аргументы, передаваемые в теле запроса:
    - date1 - дата начала периода, за который осуществляется запрос
    - date2 - дата конца периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def tasks_general_view(request):

    if request.method == 'POST':
        logging.warning(f'[Tasks general orders info] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')

        url = f"{JANDEX_STAT}id={jandexid}&metrics=ym:s:visits&metrics=ym:s:productBasketsUniq\
&metrics=ym:s:productBasketsQuantity&metrics=ym:s:ecommercePurchases&metrics=ym:s:ecommerceRevenue\
&metrics=ym:s:ecommerceRevenuePerPurchase&date1={date1}&date2={date2}\
&dimensions=ym:s:<attribution>TrafficSource"
        result = fetch(url)
        logging.warning(f'[Tasks general orders request] returning requested data')
        return JsonResponse(result, safe = False)


""" Возвращает общие данные по числу заказов, среднему доходу, доходу с посещения ...
    Аргументы, передаваемые в теле запроса:
    - date1 - дата начала периода, за который осуществляется запрос
    - date2 - дата конца периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def tasks_year_view(request):

    if request.method == 'POST':
        logging.warning(f'[Tasks order by month info] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')
        group_string = '&group=day'
        if request.path == '/api/jandexdata/tasks/year':
            group_string = '&group=month'
        url = f"{JANDEX_STAT_BY_TIME}id={jandexid}&metrics=ym:s:ecommercePurchases&metrics=ym:s:ecommerceRevenue\
&metrics=ym:s:ecommerceRevenuePerPurchase&date1={date1}&date2={date2}{group_string}\
&dimensions=ym:s:<attribution>TrafficSource"
        result = fetch(url)
        logging.warning(f'[Threads order by month request] returning requested data')
        return JsonResponse(result, safe = False)



""" Возвращает число визитов, сгруппированных по источнику трафика для конкретного счетчика (сайта)
    Аргументы, передаваемые в теле запроса:
    - date1 - дата начала периода, за который осуществляется запрос
    - date2 - дата конца периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def visits_view(request):

    if request.method == 'POST':
        logging.warning(f'[Jandexdata Visits view] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')
        url = f"{JANDEX_STAT}id={jandexid}&metrics=ym:s:visits\
&date1={date1}&date2={date2}&dimensions=ym:s:<attribution>TrafficSource"
        result = fetch(url)
        logging.warning(f'[Jandexdata Visits view] returning requested data')
        return JsonResponse(result, safe = False)


""" Возвращает число визитов, товаров в корзине, заказов, стоимость купленных товаров, доход
    Аргументы, передаваемые в теле запроса:
    - date1 - дата начала периода, за который осуществляется запрос
    - date2 - дата конца периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def funnel_view(request):

    if request.method == 'POST':
        logging.warning(f'[Jandexdata Funnel view] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1 = request_body.get('date1')
        date2 = request_body.get('date2')
        url = f"{JANDEX_STAT}id={jandexid}&metrics=ym:s:visits\
&metrics=ym:s:productBasketsUniq&metrics=ym:s:productBasketsQuantity\
&metrics=ym:s:ecommercePurchases&metrics=ym:s:productPurchasedPrice\
&metrics=ym:s:ecommerceRevenue\
&date1={date1}&date2={date2}&dimensions=ym:s:<attribution>TrafficSource"
        result = fetch(url)
        logging.warning(f'[Jandexdata Funnel view] returning requested data')
        return JsonResponse(result, safe = False)


""" Возвращает число визитов, заказов, стоимость купленных товаров, средний чек, лиды по поисковой ситсеме
    Аргументы, передаваемые в теле запроса:
    Два диапазона для сравения
    - date1_a - дата начала первого периода, за который осуществляется запрос
    - date2_a - дата конца первого периода, за который осуществляется запрос
    - date1_b - дата начала второго периода, за который осуществляется запрос
    - date2_b - дата конца второго периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def search_engine(request):

    if request.method == 'POST':
        logging.warning(f'[Jandexdata Search Engine View] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1_a = request_body.get('date1_a')
        date2_a = request_body.get('date2_a')
        date1_b = request_body.get('date1_b')
        date2_b = request_body.get('date2_b')
        url = f"{JANDEX_STAT_COMPARE}id={jandexid}&metrics=ym:s:visits,\
ym:s:ecommercePurchases,ym:s:productPurchasedPrice,ym:s:ecommerceRevenuePerPurchase&date1_a={date1_a}&date2_a={date2_a}&\
&date1_b={date1_b}&date2_b={date2_b}&dimensions=ym:s:<attribution>SearchEngineRoot&attribution=last"
        result = fetch(url)
        logging.warning(f'[Jandexdata Search Engine View] returning requested data')
        return JsonResponse(result, safe = False)


""" 
    Возвращает число визитов, заказов, стоимость купленных товаров, средний чек, лиды по социальной сети
    Аргументы, передаваемые в теле запроса:
    Два диапазона для сравения
    - date1_a - дата начала первого периода, за который осуществляется запрос
    - date2_a - дата конца первого периода, за который осуществляется запрос
    - date1_b - дата начала второго периода, за который осуществляется запрос
    - date2_b - дата конца второго периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def social_network(request):

    if request.method == 'POST':
        logging.warning(f'[Jandexdata Social Network View] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1_a = request_body.get('date1_a')
        date2_a = request_body.get('date2_a')
        date1_b = request_body.get('date1_b')
        date2_b = request_body.get('date2_b')
        url = f"{JANDEX_STAT_COMPARE}id={jandexid}&metrics=ym:s:visits,\
ym:s:ecommercePurchases,ym:s:productPurchasedPrice,ym:s:ecommerceRevenuePerPurchase&date1_a={date1_a}&date2_a={date2_a}&\
&date1_b={date1_b}&date2_b={date2_b}&dimensions=ym:s:<attribution>SocialNetwork&attribution=last"
        print(url)
        result = fetch(url)
        logging.warning(f'[Jandexdata Social Network View] returning requested data')
        return JsonResponse(result, safe = False)


""" 
    Аналогичен funnel_view но за два периода
    Возвращает число визитов, товаров в корзине, заказов, стоимость купленных товаров, доход и средний чек 
    Аргументы, передаваемые в теле запроса:
    - date1 - дата начала периода, за который осуществляется запрос
    - date2 - дата конца периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def traffic_view(request):

    if request.method == 'POST':
        logging.warning(f'[Jandexdata Traffic Source View] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1_a = request_body.get('date1_a')
        date2_a = request_body.get('date2_a')
        date1_b = request_body.get('date1_b')
        date2_b = request_body.get('date2_b')
        url = f"{JANDEX_STAT_COMPARE}id={jandexid}&metrics=ym:s:visits,\
ym:s:ecommercePurchases,ym:s:productPurchasedPrice,ym:s:ecommerceRevenuePerPurchase&date1_a={date1_a}&date2_a={date2_a}&\
&date1_b={date1_b}&date2_b={date2_b}&dimensions=ym:s:<attribution>TrafficSource&attribution=last\
&filters=ym:s:lastTrafficSource=.('direct', 'internal', 'recommend', 'email')"
        result = fetch(url)
        logging.warning(f'[Jandexdata Traffic Source View] returning requested data')
        return JsonResponse(result, safe = False)


""" 
    Возвращает число визитов, заказов, стоимость купленных товаров, средний чек, лиды 
    по сайтам, с которых осуществллся переход
    Аргументы, передаваемые в теле запроса:
    Два диапазона для сравения
    - date1_a - дата начала первого периода, за который осуществляется запрос
    - date2_a - дата конца первого периода, за который осуществляется запрос
    - date1_b - дата начала второго периода, за который осуществляется запрос
    - date2_b - дата конца второго периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def referal_source(request):

    if request.method == 'POST':
        logging.warning(f'[Jandexdata Referal Source View] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1_a = request_body.get('date1_a')
        date2_a = request_body.get('date2_a')
        date1_b = request_body.get('date1_b')
        date2_b = request_body.get('date2_b')
        url = f"{JANDEX_STAT_COMPARE}id={jandexid}&metrics=ym:s:visits,\
ym:s:ecommercePurchases,ym:s:productPurchasedPrice,ym:s:ecommerceRevenuePerPurchase&date1_a={date1_a}&date2_a={date2_a}&\
&date1_b={date1_b}&date2_b={date2_b}&dimensions=ym:s:<attribution>ReferalSource&attribution=last"
        result = fetch(url)
        logging.warning(f'[Jandexdata Referal Source View] returning requested data')
        return JsonResponse(result, safe = False)


""" 
    Возвращает число визитов, заказов, стоимость купленных товаров, средний чек, лиды 
    по рекламным ссылкам
    Аргументы, передаваемые в теле запроса:
    Два диапазона для сравения
    - date1_a - дата начала первого периода, за который осуществляется запрос
    - date2_a - дата конца первого периода, за который осуществляется запрос
    - date1_b - дата начала второго периода, за который осуществляется запрос
    - date2_b - дата конца второго периода, за который осуществляется запрос
    - jandexid - id проекта в Яндекс Метрике
"""

@csrf_exempt
def  adv_engine(request):

    if request.method == 'POST':
        logging.warning(f'[Jandexdata Ad Source View] POST')
        request_body = json.loads(request.body)
        jandexid = int(request_body.get('jandexid'))
        date1_a = request_body.get('date1_a')
        date2_a = request_body.get('date2_a')
        date1_b = request_body.get('date1_b')
        date2_b = request_body.get('date2_b')
        url = f"{JANDEX_STAT_COMPARE}id={jandexid}&metrics=ym:s:visits,\
ym:s:ecommercePurchases,ym:s:productPurchasedPrice,ym:s:ecommerceRevenuePerPurchase&date1_a={date1_a}&date2_a={date2_a}&\
&date1_b={date1_b}&date2_b={date2_b}&dimensions=ym:s:<attribution>AdvEngine&attribution=last"
        result = fetch(url)
        logging.warning(f'[Jandexdata Ad Source View] returning requested data')
        return JsonResponse(result, safe = False)