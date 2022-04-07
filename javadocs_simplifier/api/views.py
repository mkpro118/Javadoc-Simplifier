from django.shortcuts import render
from .simplifier import generator
from django.http.response import JsonResponse

# Create your views here.


def home(request):
    return render(request, 'Javadocs Simplifier.html')


def api(request, url):
    url = url.replace('`', '/')
    successful, name, stub = generator(url)
    return JsonResponse({
        'successful': successful,
        'name': name,
        'stub': stub,
    })
