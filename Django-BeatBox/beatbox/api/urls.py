from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register_user),
    path('login', views.login_user),
    path('update-password', views.update_password),
    path('delete-account', views.delete_account),
    path('update-song/<int:song_id>', views.update_song),
    path('delete-song/<int:song_id>', views.delete_song),
]