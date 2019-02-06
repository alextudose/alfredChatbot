from django.conf.urls import url
from api import views
from .chatbotmanager import ChatbotManager

urlpatterns = [
    url(r'^bot/$', views.call_bot),
]