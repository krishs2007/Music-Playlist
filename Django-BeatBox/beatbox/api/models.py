from django.db import models

class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    genre = models.CharField(max_length=100)
    cover_url = models.URLField(max_length=500) # To store the image links

    def __str__(self):
        return f"{self.title} by {self.artist}"