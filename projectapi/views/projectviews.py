from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from projectapi.models import Project, WebPage, Employee, ProjectEmployeeConnection
from projectapi.serializers import ProjectSerializer, EmployeeSerializer

import logging
import json

logging.basicConfig(level=logging.INFO)

@csrf_exempt
def get_project_view(request):

    if request.method == 'GET':
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many = True)
        logging.info(f'Retrieving all projects')
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})


""" View для создания нового проекта
    Входные данные, необходимые для создания модели Project
    - name - название проекта (уникальное)
    - type - тип проекта (ENUM) на данный момент два типа
        STORE = 'IS', ('Интернет-магазин')
        CORPORATIVE = 'CS', ('Корпоративный сайт')
    - employee - id сотрудника - руководителя проекта (либо менеджера)
    - webpage_id - jandexid проекта в Яндекс Метрике (идет привязка 1 к 1 с преоктом в Яндекс Метрика)
"""

@csrf_exempt
def create_project_view(request):

    if request.method == 'POST':
        
        request_body = json.loads(request.body)
        project_name = request_body.get('name')
        project_type = request_body.get('_type')
        employee_id = request_body.get('employee')
        webpage_id = request_body.get('webpage')
        logging.info(f'\n[Create project request\nname = {project_name}\ntype = {project_type}\nemployee = {employee_id}\nwebpage = {webpage_id}]')

        try:
            connected_webpage = WebPage.objects.get(jandexid = webpage_id)
            logging.info(f'Successfully found wepage: {connected_webpage}')
        except WebPage.DoesNotExist:
            logging.warning('JandexId of Webpage has not been found')
            return JsonResponse({"STATUS_CODE": 404})

        try:
            connected_employee = Employee.objects.get(id = employee_id)
            logging.info(f'Successfully found employee: {connected_employee}')
        except Employee.DoesNotExist:
            logging.warning('ID of Employee has not been found')
            return JsonResponse({"STATUS_CODE": 404})

        try:
            new_project = Project(name = project_name, _type = Project.TYPE_CHOICES(project_type), webpage = connected_webpage, jandexid = webpage_id)
            new_project.save()

            project_employee_connection = ProjectEmployeeConnection(project = new_project, employee = connected_employee)
            project_employee_connection.save()
            
            serializer = ProjectSerializer(new_project)
            logging.info(f'Successfully created new project {new_project.id}')
            return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
        except IntegrityError:
            logging.warning(f'Unique project name constraint failed')
            return JsonResponse({"STATUS_CODE": 404, 'MESSAGE': 'Project with such name already exists'})


@csrf_exempt
def get_project_by_id_view(request, pk):

    if request.method == 'GET':
        try:
            project = Project.objects.get(id = pk)
            serializer = ProjectSerializer(project)
            logging.info(f'Get project by id: Successfully retrived project {pk}')
            return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
        except Project.DoesNotExist:
            logging.info(f'Get project by id: Project {pk} not found')
            return JsonResponse({'STATUS_CODE': 404}) 

@csrf_exempt
def delete_project_view(request, pk):

    if request.method == 'GET':
        try:
            project = Project.objects.get(id = pk)
            project.delete()
            logging.info(f'Delete project: Successfully deleted project {pk}')
            return JsonResponse({'STATUS_CODE': 200})
        except Project.DoesNotExist:
            logging.info(f'Delete project: Deletion was not successfull project {pk} not found')
            return JsonResponse({'STATUS_CODE': 404})

@csrf_exempt
def add_user_to_project_view(request, pk, uid):

    if request.method == 'GET':
        try:
            project = Project.objects.get(id = pk)
            logging.info(f'Add user: Successfully retrieved project {pk}')
        except Project.DoesNotExist:
            logging.info(f'Add user: project {pk} not found')
            return JsonResponse({'STATUS_CODE': 404, 'MESSAGE': 'PROJECT NOT FOUND'})
        try:
            employee = Employee.objects.get(id = uid)
            logging.info(f'Add user: Successfully retrieved employee {uid}')
        except Employee.DoesNotExist:
            logging.info(f'Add user: employee {uid} not found')
            return JsonResponse({'STATUS_CODE': 404, 'MESSAGE': 'EMPLOYEE NOT FOUND'})

        try:
            new_connection = ProjectEmployeeConnection(project = project, employee = employee)
            new_connection.save()
            serializer = EmployeeSerializer(employee)
            logging.info(f'Add user: successfully created new connection')
            return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
        except IntegrityError:
            logging.info(f'Add user: connection already exist')
            return JsonResponse({'STATUS_CODE': 500, 'MESSAGE': 'EMPLOYEE PROJECT CONNECTION ALREADY EXIST'})

