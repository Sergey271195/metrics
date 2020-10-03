from django.shortcuts import render
from django.http import JsonResponse

def mainview(request):
    return render(request, 'index.html')
