from django.urls import path
import toxicityClassifier.apps as app

urlpatterns = [
    path('', app.checkIsTocic, 'toxicityCheck')
]