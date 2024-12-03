import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../payment/PaymentForm";

const stripePromise = loadStripe("pk_test_RQb9JxvZ4nVw4mj6vP9t7d7k");

const CourseDetails = ({ user }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    // Fetch the course details
    fetch(`http://localhost:5000/api/courses/${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setLoading(false);
      });
  }, [courseId]);

  const handlePaymentSuccess = () => {
    setHasPaid(true);
    alert("Payment successful! You can now view the course.");
  };


  if (loading) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="h5" color="error">
          Course Not Found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "8px" }}>
        <Typography variant="h4" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {course.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Difficulty Level: {course.difficulty_level}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Duration: {course.duration} hours
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Instructor: {course.instructor || "N/A"}
        </Typography>
        <Box>
          {course.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              sx={{ margin: "0.25rem" }}
              color="primary"
            />
          ))}
        </Box>

        <Box sx={{ marginTop: "2rem" }}>
          {hasPaid ? (
            <video
              src={course.video_path}
              controls
              style={{ width: "100%", maxHeight: "400px" }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Price: $5
              </Typography>
              <Elements stripe={stripePromise}>
                <PaymentForm mentor={{ price: 5 }} onPaymentSuccess={handlePaymentSuccess} />
              </Elements>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CourseDetails;
