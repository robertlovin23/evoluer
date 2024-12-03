import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import PaymentForm from "../payment/PaymentForm";
import PersonIcon from "@mui/icons-material/Person";

const stripePromise = loadStripe("pk_test_RQb9JxvZ4nVw4mj6vP9t7d7k");

const MentorSelection = ({ user }) => {
  const [mentors, setMentors] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/mentors")
      .then((res) => res.json())
      .then((data) => {
        const userTags = user.tags || [];
        const mentorsWithProcessedExpertise = data.mentors.map((mentor) => ({
          ...mentor,
          expertise: typeof mentor.expertise === "string"
            ? mentor.expertise.split(",").map((tag) => tag.trim())
            : mentor.expertise,
        }));
        setMentors(mentorsWithProcessedExpertise);
        if (userTags) {
          const filteredMentors = mentorsWithProcessedExpertise.filter((mentor) =>
            mentor.expertise.some((tag) => userTags.includes(tag))
          );
          setRecommendedMentors(filteredMentors);
        }
      })
      .catch((error) => console.error("Error fetching mentors:", error));
  }, [user]);

  const handleScheduleSession = async () => {
    if (!selectedMentor || !selectedDateTime) {
      alert("Please select a date and time for your session.");
      return;
    }
    const data = {
      student_id: user.id,
      mentor_id: selectedMentor.id,
      amount: selectedMentor.price * 100,
      start_time: selectedDateTime.toISOString(), // Use the selected date and time
      student_email: user.email,
    };

    try {
      const response = await fetch("http://localhost:5000/api/schedule-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Session scheduled successfully!");
        window.location.href = result.redirect_url || "/";
      } else {
        const errorData = await response.json();
        alert(`Failed to schedule session: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error scheduling session:", error);
      alert("An error occurred while scheduling the session.");
    }
  };

  return (
      <Box sx={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Recommended Mentors
        </Typography>
        <Grid container spacing={3} sx={{ marginBottom: "2rem" }}>
          {recommendedMentors.length > 0 ? (
            recommendedMentors.map((mentor) => (
              <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                <Card elevation={3} sx={{ borderRadius: "10px" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        margin: "0 auto",
                        bgcolor: "primary.light",
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" sx={{ marginTop: "0.5rem" }}>
                      {mentor.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ margin: "0.5rem 0" }}
                    >
                      {mentor.bio}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Price:</strong> ${mentor.price} per session
                    </Typography>
                    <Box sx={{ marginBottom: "1rem" }}>
                      {mentor.expertise.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          color="primary"
                          sx={{ margin: "0.2rem" }}
                        />
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ marginRight: "1rem" }}
                      onClick={() => navigate(`/mentor-details/${mentor.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setSelectedMentor(mentor)}
                    >
                      Book a Session
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No mentors match your interests.</Typography>
          )}
        </Grid>
      </Box>
    );
};

export default MentorSelection;
