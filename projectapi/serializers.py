from django.http import JsonResponse
from rest_framework import serializers
from .models import Employee, WebPage, Project, ProjectEmployeeConnection, Goal


class EmployeeSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only = True)
    name = serializers.CharField()
    role = serializers.CharField(source='get_role_display')

class ProjectsEmployeesField(serializers.Field):
    
    def to_representation(self, value):
        connections = ProjectEmployeeConnection.objects.filter(project__id = value.id)
        employees= [connection.employee for connection in connections]
        serializer = EmployeeSerializer(employees, many = True)
        return serializer.data



class WebPageSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only = True)
    jandexid = serializers.IntegerField()
    name = serializers.CharField()

class ProjectSerializer(serializers.Serializer):

    employees = ProjectsEmployeesField(source='*')

    id = serializers.IntegerField(read_only = True)
    name = serializers.CharField(allow_blank = True, allow_null = True)
    _type = serializers.CharField(source='get__type_display')
    webpage = WebPageSerializer(read_only = True)


class ProjectEmployeeConnectionSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only = True)
    project = ProjectSerializer(many = True)
    employee = EmployeeSerializer(many = True)

class GoalSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only = True)
    jandexid = serializers.IntegerField(read_only = True)
    name = serializers.CharField()
