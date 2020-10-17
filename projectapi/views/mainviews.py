from django.shortcuts import render
from django.http import JsonResponse
from projectapi.models import WebPage
from projectapi.serializers import WebPageSerializer

import requests
import os

METRIC_TOKEN = os.environ.get('METRIC_TOKEN')
PIXEL_TOKEN = os.environ.get('PIXEL_TOKEN')

def tokenview(request):
    return JsonResponse({'token': METRIC_TOKEN})


def refreshwebpages(request):

    req = requests.get('https://api-metrika.yandex.net/management/v1/counters', headers = {
        "Authorization": f"OAuth {METRIC_TOKEN}"
    })
    webpages = req.json().get('counters')
    for page in webpages:
        jandexid = page.get('id')
        name = page.get('name')
        try:
            WebPage.objects.get(jandexid = jandexid)
        except WebPage.DoesNotExist:
            newpage = WebPage(jandexid = jandexid, name = name)
            newpage.save()
    return JsonResponse({'STATUS_CODE': 200})


def getwebpages(request):
    try:
        webpages = WebPage.objects.all()
        serializer = WebPageSerializer(webpages, many = True)
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
    except Exception as e:
        return JsonResponse({'STATUS_CODE': 404})