from django.db import models


class Employee(models.Model):

    PROJECT_HEAD = 'PH'
    MARKETER = 'IM'
    SEO_SPECIALIST = 'SS'

    ROLE_CHOICES = [
        (PROJECT_HEAD, 'Руководитель проекта'),
        (MARKETER, 'Интернет-маркетолог'),
        (SEO_SPECIALIST, 'SEO-специалист'),
    ]

    name = models.CharField(max_length = 100, blank = True, null = True)
    role = models.CharField(max_length = 2, choices = ROLE_CHOICES, null = True)


class WebPage(models.Model):

    jandexid = models.IntegerField()


class Project(models.Model):

    STORE = 'IS'
    CORPORATIVE = 'CS'

    TYPE_CHOICES = [
        (STORE, 'Интернет-магазин'),
        (CORPORATIVE, 'Корпоративный сайт'),
    ]

    name = models.CharField(max_length = 100, blank = True, null = True)
    _type = models.CharField(max_length = 2, choices = TYPE_CHOICES, null = True)
    webpage = models.ForeignKey(WebPage, on_delete = models.CASCADE)


class ProjectEmployeeConnection(models.Model):

    project = models.ForeignKey(Project, on_delete = models.CASCADE, related_name = 'employee')
    employee = models.ForeignKey(Employee, on_delete = models.CASCADE, related_name = 'project')

