from django.shortcuts import render
from django.http import JsonResponse

def templateapiview(request):

    return JsonResponse({
        'data': 'Dummy data'
    })
