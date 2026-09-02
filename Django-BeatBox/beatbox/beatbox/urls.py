from django.contrib import admin
from django.urls import path, include
from api import views as api_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),            # Maps to api/urls.py
    path('', api_views.home, name='home'),        # Serves the index.html on the root URL
]