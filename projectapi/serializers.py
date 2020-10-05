from rest_framework import serializers
from .models import Employee, WebPage, Project, ProjectEmployeeConnection


class EmployeeSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only = True)
    name = serializers.CharField()
    role = serializers.CharField()

class WebPageSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only = True)
    jandexid = serializers.IntegerField()

class ProjectSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only = True)
    name = serializers.CharField(allow_blank = True, allow_null = True)
    _type = serializers.ChoiceField(Project.TYPE_CHOICES, allow_null = True, allow_blank = True)
    webpage = WebPageSerializer(read_only = True)


class ProjectEmployeeConnectionSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only = True)
    project = ProjectSerializer(many = True)
    employee = EmployeeSerializer(many = True)