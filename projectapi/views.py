""" from django.shortcuts import render
from django.http import JsonResponse
from .serializers import EmployeeSerializer

import os



METRIC_TOKEN = os.environ.get('METRIC_TOKEN')


def templateapiview(request):

    return JsonResponse({
        'data': 'Dummy data'
    })

def tokenview(request):
    return JsonResponse({'token': METRIC_TOKEN}) """
