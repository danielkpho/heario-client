from django.urls import path
from .views import HomePageView, LobbyPageView

urlpatterns = [
    path("lobby/", LobbyPageView.as_view(), name="lobby"),
    path("", HomePageView.as_view(), name="home"),
]