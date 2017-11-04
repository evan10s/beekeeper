from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Treatment

@csrf_exempt
def myTestView(request):
    if request.method == "POST":
        #request.data =
        Treatment.objects.get(bg.__gte__="70")
        return HttpResponse(json.dumps({'data',request.POST,'speech': 'Hi there', "displayText": "Hi there!"}),content_type="text/json")
    return HttpResponseForbidden("403 Forbidden")
