# payments/urls.py

from django.urls import path
from .views import CreateCheckoutSessionAPIView

urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSessionAPIView.as_view(), name='create-checkout-session'),
]