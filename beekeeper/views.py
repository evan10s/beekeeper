from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import decimal
from .models import Treatment
import datetime;

@csrf_exempt
def addTreatment(request):
    if request.method == "POST":
        #request.data =
        #Treatment.objects.get(bg.__gte__="70")
        #print(request.POST.get('lang',0))
        #return HttpResponse(json.dumps({'speech': 'Hi there', "displayText": "Hi there!"}),content_type="text/json")
        bg_entered = int(request.POST['bg'])
        dose_entered = decimal.Decimal(request.POST['dose'])
        meal_entered = request.POST['meal']
        carbs_entered = int(request.POST['carbs'])
        
        #treat = Treatment(bg=4,owner=re)
        treat = Treatment(bg=bg_entered,meal=meal_entered,dose=dose_entered,carbs=carbs_entered,timestamp=datetime.datetime.now())
        treat.save()

        print("type carbs")
        #print(type(carbs))

        return HttpResponse(json.dumps({'carbs':3}),content_type="application/json")
    return HttpResponseForbidden("403 Forbidden")

@csrf_exempt
def findPattern(request):
    return HttpResponse(json.dumps({ "type": "High",
        "data": [ {
            "day": "Monday",
            "bg": 189
        },  {
            "day": "Tuesday",
            "bg": 170 }
        ]
    }), content_type="application/json")
    # highPattern = findHighPattern(meal)

def findHighPattern(meal):
    Treatment.objects.filter()
    pass

def findLowPattern(meal):
    pass
