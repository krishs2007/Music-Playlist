from django.contrib import admin
from .models import User, Song

# Register your models here so they appear in the Admin Panel
admin.site.register(User)
admin.site.register(Song)