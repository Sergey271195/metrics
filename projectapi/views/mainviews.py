from django.shortcuts import render
from django.http import JsonResponse
from projectapi.models import WebPage, Project
from projectapi.serializers import WebPageSerializer, ProjectSerializer

import requests
import os
import datetime

METRIC_TOKEN = os.environ.get('METRIC_TOKEN')
PIXEL_TOKEN = os.environ.get('PIXEL_TOKEN')

""" Вспомогательная функция для получениядполнительной информации о веб странице из Яндекс метрики
    (Url, дата создания)
    Входные параметры - id веб страницы на Яндекс Метрика
"""
def fecth_webpage_info(jandexid):
    info = requests.get(f"https://api-metrika.yandex.net/management/v1/counter/{jandexid}", headers = {
        "Authorization": f"OAuth {METRIC_TOKEN}"
    })
    json_ = info.json()
    data = json_.get('counter')
    create_time = data.get('create_time')
    date = datetime.datetime.strptime(create_time.split('+')[0], '%Y-%m-%dT%H:%M:%S')
    url = data.get('site')
    return {
        'create_time': date,
        'url': url,
    }

def tokenview(request):
    return JsonResponse({'token': 'METRIC_TOKEN'})


def refreshwebpages(request):

    req = requests.get('https://api-metrika.yandex.net/management/v1/counters', headers = {
        "Authorization": f"OAuth {METRIC_TOKEN}"
    })
    webpages = req.json().get('counters')
    for page in webpages:
        jandexid = page.get('id')
        name = page.get('name')
        info = fecth_webpage_info(jandexid)
        try:
            webpage = WebPage.objects.get(jandexid = jandexid)
        except WebPage.DoesNotExist:
            newpage = WebPage(jandexid = jandexid, name = name, url = info.get('url'), create_time = info.get('create_time'))
            newpage.save()
    return JsonResponse({'STATUS_CODE': 200})


def getwebpages(request):
    try:
        webpages = WebPage.objects.all()
        serializer = WebPageSerializer(webpages, many = True)
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
    except Exception as e:
        return JsonResponse({'STATUS_CODE': 404})