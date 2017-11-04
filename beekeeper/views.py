from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def myTestView(request):
    return HttpResponse(json.dumps({'speech': 'Hi there', "displayText": "Hi there!"}),content_type="text/json")
