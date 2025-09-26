# backend/urls.py

from django.contrib import admin
from django.urls import path, include  # Make sure to import include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/payments/', include('payments.urls')),  # Add this line
]