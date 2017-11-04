from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
#from .models import Treatment

@csrf_exempt
def myTestView(request):
    if request.method == "POST":
        #request.data =
        #Treatment.objects.get(bg.__gte__="70")
        #print(request.POST.get('lang',0))
        #return HttpResponse(json.dumps({'speech': 'Hi there', "displayText": "Hi there!"}),content_type="text/json")
        return HttpResponse(json.dumps({'displayText':request.body.result.action, 'speech':"It worked"}))
    return HttpResponseForbidden("403 Forbidden")
