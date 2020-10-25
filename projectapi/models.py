from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

import requests
import os
import logging

logging.basicConfig(level=logging.INFO)

class Employee(models.Model):

    class ROLE_CHOICES(models.TextChoices):
        PROJECT_HEAD = 'PH', ('Руководитель проекта')
        MARKETER = 'IM', ('Интернет-маркетолог')
        SEO_SPECIALIST = 'SS', ('SEO-специалист')

    name = models.CharField(max_length = 100, blank = True, null = True, unique = True)
    role = models.CharField(max_length = 2, choices = ROLE_CHOICES.choices, null = True)

    def __str__(self):
        return f'{self.name}'


class WebPage(models.Model):

    jandexid = models.IntegerField()
    name = models.CharField(max_length = 100, blank = True, null = True)
    url = models.CharField(max_length = 200, blank = True, null =True)
    create_time = models.DateTimeField(blank = True, null = True)

    def __str__(self):
        return f'{self.name}'


class Project(models.Model):

    class TYPE_CHOICES(models.TextChoices):
        STORE = 'IS', ('Интернет-магазин')
        CORPORATIVE = 'CS', ('Корпоративный сайт')

    name = models.CharField(max_length = 100, blank = True, null = True, unique = True)
    _type = models.CharField(max_length = 2, choices = TYPE_CHOICES.choices, null = True)
    webpage = models.ForeignKey(WebPage, on_delete = models.CASCADE)
    jandexid = models.IntegerField(default = 0)

    def __str__(self):
        return f'{self.name}'


class ProjectEmployeeConnection(models.Model):

    project = models.ForeignKey(Project, on_delete = models.CASCADE, related_name = 'employee')
    employee = models.ForeignKey(Employee, on_delete = models.CASCADE, related_name = 'project')


class Goal(models.Model):

    jandexid = models.IntegerField()
    name = models.CharField(max_length = 500)
    active = models.BooleanField(default = True)
    project = models.ForeignKey(Project, on_delete = models.CASCADE)


METRIC_TOKEN = os.environ.get('METRIC_TOKEN')
HEADERS = {"Authorization": f"OAuth {METRIC_TOKEN}"}

""" Функция для инициализации целей проекта
    Запускается при создании проекта (привязка к событию создания проекта)
    Создаются объекты Goal с привязкой к объекту Project
"""
@receiver(post_save, sender=Project)
def goals_initial(sender, instance, **kwargs):
    logging.info(f'[Goals initializer] project has been created -> starting goals creation')
    jandexid = instance.webpage.jandexid
    req = requests.get(f"https://api-metrika.yandex.net/management/v1/counter/{jandexid}/goals", headers = HEADERS)
    json_ = req.json()
    for goal in json_.get('goals'):
        try:
            new_goal = Goal(jandexid = goal.get('id'), name = goal.get('name'), project = instance)
            new_goal.save()
            logging.info(f'[Goals initializer] successfully created Goal {new_goal.id} for Project {instance.id}')
        except Exception as e:
            logging.info(f'[Goals initializer] error while creating Goals for Project {instance.id}')
            logging.info(e)
