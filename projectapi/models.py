from django.db import models


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

    def __str__(self):
        return f'{self.name}'


class Project(models.Model):

    class TYPE_CHOICES(models.TextChoices):
        STORE = 'IS', ('Интернет-магазин')
        CORPORATIVE = 'CS', ('Корпоративный сайт')

    name = models.CharField(max_length = 100, blank = True, null = True, unique = True)
    _type = models.CharField(max_length = 2, choices = TYPE_CHOICES.choices, null = True)
    webpage = models.ForeignKey(WebPage, on_delete = models.CASCADE)

    def __str__(self):
        return f'{self.name}'


class ProjectEmployeeConnection(models.Model):

    project = models.ForeignKey(Project, on_delete = models.CASCADE, related_name = 'employee')
    employee = models.ForeignKey(Employee, on_delete = models.CASCADE, related_name = 'project')

