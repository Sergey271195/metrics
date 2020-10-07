from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from projectapi.models import Employee
from projectapi.serializers import EmployeeSerializer

import json

@csrf_exempt
def get_employee_view(request):

    if request.method == 'GET':
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many = True)
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})

@csrf_exempt
def create_employee_view(request):

    if request.method == 'POST':
        request_body = json.loads(request.body)
        name = request_body.get('name')
        role = request_body.get('role')
        try:
            new_employee = Employee(name = name, role = Employee.ROLE_CHOICES(role))
            new_employee.save()
            serializer = EmployeeSerializer(new_employee)
            return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
        except IntegrityError:
            return JsonResponse({'STATUS_CODE': 404})



@csrf_exempt
def delete_employee_view(request, pk):

    try:
        employee_to_delete = Employee.objects.get(id = pk)
        serializer = EmployeeSerializer(employee_to_delete)
        employee_to_delete.delete()
        return JsonResponse({'STATUS_CODE': 200})
    except Employee.DoesNotExists:
        return JsonResponse({'STATUS_CODE': 404})


""" def get_employee_by_id_view(request, pk):

    try:
        employee = Employee.objects.get(id = pk)
        serializer = EmployeeSerializer(employee)
        return JsonResponse(serializer.data, safe = False, json_dumps_params={'ensure_ascii': False})
    except Employee.DoesNotExists:
        return JsonResponse({'STATUS_CODE': 404}) """