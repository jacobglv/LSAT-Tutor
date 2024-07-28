from django.urls import path
from . import views

urlpatterns = [
    path("sessions/", views.SessionListCreate.as_view(), name="sessions"),
    path("question/", views.fetch_question, name="question"),
    path("summary/", views.fetch_summary, name="summary"),
    
]