from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from projectapi.models import Goal, Project
from projectapi.serializers import GoalSerializer

import logging
import json
import os
import requests

logging.basicConfig(level=logging.INFO)

METRIC_TOKEN = os.environ.get('METRIC_TOKEN')
HEADERS = {"Authorization": f"OAuth {METRIC_TOKEN}"}

""" View для получения всех целей конкретного проекта 
    Входные данные:
        - pk - jandexid проекта
    Цели фильтруются по активности. Возвращаются только активные цели
"""
def get_project_goals(request, pk):
    refreshgoals(pk)
    logging.info(f'[GET GOALS] requesting goals for Project {pk}')
    projects = Project.objects.all()
    try:
        goals = Goal.objects.filter(project__jandexid = pk).filter(active = True)
        serializer = GoalSerializer(goals, many = True)
        print(serializer.data)
        logging.info(f'[GET GOALS] successfully returning goals for Project {pk}')
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
    except Exception as e:
        logging.info(f'[GET GOALS] error while returning goals for Project {pk}')
        logging.info(e)

""" View для получения всех целей конкретного проекта 
    Входные данные:
        - pk - id проекта
    Цели фильтруются по активности. Возвращаются только неактивные цели
"""
def get_project_goals_all(request, pk):
    logging.info(f'[GET GOALS ALL] requesting goals for Project {pk}')
    try:
        goals = Goal.objects.filter(project__jandexid = pk)
        serializer = GoalSerializer(goals, many = True)
        logging.info(f'[GET GOALS ALL] successfully returning goals for Project {pk}')
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
    except Exception as e:
        logging.info(f'[GET GOALS ALL] error while returning goals for Project {pk}')
        logging.info(e)

""" Перевод цели в неактивное состояние (не отображается на графиках и в таблицах) """
def disable_goal(request, pk):
    logging.info(f'[DISABLE GOAL] switching to active = False for Goal {pk}')
    try:
        goal = Goal.objects.get(id = pk)
        goal.active = False
        goal.save()
        logging.info(f'[DISABLE GOAL] switching to active = False for Goal {pk}')
        return JsonResponse({"STATUS_CODE": 200, "MESSAGE": "SUCCESSFULLY DISABLED GOAL"})
    except Exception as e:
        logging.info(f'[DISABLE GOAL] error while disabeling Goal {pk}')
        logging.info(e)

""" Перевод цели в активное состояние (отображается на графиках и в таблицах) """
def enable_goal(request, pk):
    logging.info(f'[ENABLE GOAL] switching to active = False for Goal {pk}')
    try:
        goal = Goal.objects.get(id = pk)
        goal.active = True
        goal.save()
        logging.info(f'[ENABLE GOAL] switching to active = True for Goal {pk}')
        return JsonResponse({"STATUS_CODE": 200, "MESSAGE": "SUCCESSFULLY ENABLED GOAL"})
    except Exception as e:
        logging.info(f'[ENABLE GOAL] error while disabeling Goal {pk}')
        logging.info(e)

""" Проверка соответствия целей проекта из базы данных целям из Яндекс Метрики """
def refreshgoals(pk):
    logging.info(f'[Goals refresher] checking golas for Project {pk}')
    instance = Project.objects.get(jandexid = pk)
    jandexid = instance.webpage.jandexid
    req = requests.get(f"https://api-metrika.yandex.net/management/v1/counter/{jandexid}/goals", headers = HEADERS)
    json_ = req.json()
    for goal in json_.get('goals'):
        try:
            goal = Goal.objects.get(project__jandexid = pk, jandexid = goal.get('id'))
        except Goal.DoesNotExist:
            new_goal = Goal(jandexid = goal.get('id'), name = goal.get('name'), project = instance)
            new_goal.save()
            logging.info(f'[Goals refresher] new goal for Project {instance.id}')
            logging.info(f'[Goals refresher] successfully created Goal {new_goal.id} for Project {instance.id}')
    logging.info(f'[Goals refresher] successfully refreshed goals for Project {instance.id}')