// src/CheckoutForm.js

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios'; // Make sure you have axios installed (npm install axios)

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    try {
      // 1. Call your backend to create the PaymentIntent
      const response = await axios.post('http://127.0.0.1:8000/api/v1/payments/create-checkout-session/');
      const { clientSecret } = response.data;

      // 2. Confirm the card payment with the clientSecret
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        // Show error to your customer
        setError(`Payment failed: ${result.error.message}`);
        setProcessing(false);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          setError(null);
          setProcessing(false);
          setSucceeded(true);
          console.log('Payment successful!', result.paymentIntent);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '400px' }}>
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <button disabled={processing || succeeded} style={{ marginTop: '20px', width: '100%', padding: '10px' }}>
        <span>{processing ? 'Processing...' : 'Pay Now'}</span>
      </button>

      {/* Show any error that happens when processing the payment */}
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {/* Show a success message upon completion */}
      {succeeded && <div style={{ color: 'green', marginTop: '10px' }}>Payment succeeded!</div>}
    </form>
  );
};

export default CheckoutForm;