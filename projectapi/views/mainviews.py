from django.shortcuts import render
from django.http import JsonResponse
from projectapi.serializers import EmployeeSerializer

import os

METRIC_TOKEN = os.environ.get('METRIC_TOKEN')

def tokenview(request):
    return JsonResponse({'token': METRIC_TOKEN})