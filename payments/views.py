# payments/views.py

import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Set your Stripe secret key
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # For now, we'll hardcode an amount.
        # In a real app, you'd calculate this from the request data.
        amount_cents = 49900  # Example: 499.00 INR

        try:
            # Create a PaymentIntent with Stripe
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='inr',
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            
            # Return the client_secret to the frontend
            return Response({'clientSecret': intent.client_secret}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)