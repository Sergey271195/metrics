from django.urls import path
from .views import (tokenview, get_employee_view,
                     create_employee_view, delete_employee_view,
                     refreshwebpages, getwebpages,
                     create_project_view, get_project_view, delete_project_view,
                     add_user_to_project_view, get_project_by_id_view,
                     get_project_goals, disable_goal, enable_goal, get_project_goals_unactive,
                     goals_reaches_view
                    )

urlpatterns = [
    #Mainviews
    path('token/', tokenview),
    path('refreshwp/', refreshwebpages),
    path('getwp/', getwebpages),

    #Employee views
    path('employee/getall', get_employee_view),
    path('employee/create', create_employee_view),
    path('employee/delete/<int:pk>', delete_employee_view),

    #Project views
    path('project/getall', get_project_view),
    path('project/get/<int:pk>', get_project_by_id_view),
    path('project/create', create_project_view),
    path('project/delete/<int:pk>', delete_project_view),
    path('project/add/project<int:pk>/user<int:uid>', add_user_to_project_view),

    #Goals views
    path('goals/get/<int:pk>', get_project_goals),
    path('goals/get/unactive/<int:pk>', get_project_goals_unactive),
    path('goals/disable/<int:pk>', disable_goal),
    path('goals/enable/<int:pk>', enable_goal),

    #Jandex connection
    path('jandexdata/goals/reaches', goals_reaches_view),
]