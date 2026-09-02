import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import User, Song

# --- Serve the Frontend ---
def home(request):
    songs = Song.objects.all()
    return render(request, 'index.html', {'songs' : songs})

# ================================================
# CREATE — Register a new user
# ================================================
@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name, email, password = data.get('name'), data.get('email'), data.get('password')

        if not name or not email or not password:
            return JsonResponse({'success': False, 'message': 'Please fill in all fields.'})

        if len(password) < 6:
            return JsonResponse({'success': False, 'message': 'Password must be at least 6 characters.'})

        if User.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'message': 'An account with this email already exists.'})

        User.objects.create(name=name, email=email, password=password)
        return JsonResponse({'success': True, 'message': 'Account created successfully!'})
        
    return JsonResponse({'success': False, 'message': 'Invalid method.'})

# ================================================
# READ — Login (check credentials)
# ================================================
@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email, password = data.get('email'), data.get('password')

        if not email or not password:
            return JsonResponse({'success': False, 'message': 'Please fill in all fields.'})

        try:
            user = User.objects.get(email=email)
            if user.password == password:
                return JsonResponse({'success': True, 'message': f'Welcome back, {user.name}!'})
            else:
                return JsonResponse({'success': False, 'message': 'Wrong email or password.'})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Wrong email or password.'})
            
    return JsonResponse({'success': False, 'message': 'Invalid method.'})

# ================================================
# UPDATE — Change password
# ================================================
@csrf_exempt
def update_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email, old_password, new_password = data.get('email'), data.get('oldPassword'), data.get('newPassword')

        if not email or not old_password or not new_password:
            return JsonResponse({'success': False, 'message': 'Please fill in all fields.'})

        if len(new_password) < 6:
            return JsonResponse({'success': False, 'message': 'New password must be at least 6 characters.'})

        try:
            user = User.objects.get(email=email, password=old_password)
            user.password = new_password
            user.save()
            return JsonResponse({'success': True, 'message': 'Password updated successfully!'})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Current email or password is incorrect.'})
            
    return JsonResponse({'success': False, 'message': 'Invalid method.'})

# ================================================
# DELETE — Delete account
# ================================================
@csrf_exempt
def delete_account(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email, password = data.get('email'), data.get('password')

        if not email or not password:
            return JsonResponse({'success': False, 'message': 'Please fill in all fields.'})

        try:
            user = User.objects.get(email=email, password=password)
            user.delete()
            return JsonResponse({'success': True, 'message': 'Account deleted.'})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Email or password is incorrect.'})
            
    return JsonResponse({'success': False, 'message': 'Invalid method.'})

@csrf_exempt
def update_song(request, song_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            song = Song.objects.get(id=song_id)
            song.title = data.get('title', song.title)
            song.artist = data.get('artist', song.artist)
            song.genre = data.get('genre', song.genre)
            song.save() # Save changes to MySQL
            return JsonResponse({'success': True})
        except Song.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Song not found'})

# --- Delete Song Endpoint ---
@csrf_exempt
def delete_song(request, song_id):
    if request.method == 'POST':
        try:
            song = Song.objects.get(id=song_id)
            song.delete() # Remove from MySQL
            return JsonResponse({'success': True})
        except Song.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Song not found'})