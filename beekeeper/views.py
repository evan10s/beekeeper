from django.http import HttpResponse
import json

def myTestView(request):
    return HttpResponse(json.dumps({'speech': 'Hi there', "displayText": "Hi there!"}),content_type="text/json")
