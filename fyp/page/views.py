from django.shortcuts import render
from django.views.generic import TemplateView


class HomePageView(TemplateView):
    template_name = "home.html"
# Create your views here.

class LobbyPageView(TemplateView): 
    template_name = "lobby.html"