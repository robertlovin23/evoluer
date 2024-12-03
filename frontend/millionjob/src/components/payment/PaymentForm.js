import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Box, Button, Typography } from "@mui/material";

const PaymentForm = ({ mentor = {}, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!stripe || !elements) return;
  
      const cardElement = elements.getElement(CardElement);
  
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
  
      if (error) {
        console.error(error);
      } else if (mentor && mentor.price) {
        const response = await fetch("http://localhost:5000/api/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: mentor.price * 100, // Price in cents
            paymentMethodId: paymentMethod.id,
          }),
        });
  
        if (response.ok) {
          onPaymentSuccess();
        } else {
          alert("Payment failed. Please try again.");
        }
      } else {
        alert("Invalid mentor data.");
      }
    };
  
    return (
      <Box component="form" onSubmit={handleSubmit}>
        <CardElement />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: "1rem" }}
          disabled={!mentor || !mentor.price}
        >
          Pay ${mentor?.price || 0}
        </Button>
      </Box>
    );
};
  

export default PaymentForm;
