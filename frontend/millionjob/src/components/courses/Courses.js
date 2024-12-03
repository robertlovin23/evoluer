import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [personalizedCourses, setPersonalizedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paidCourses, setPaidCourses] = useState([]);

  // Fetch courses from the API
  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:5000/api/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data.courses);

        // Personalize courses based on user tags
        const userTags = user.tags || [];
        const filteredCourses = data.courses.filter((course) =>
          course.tags.some((tag) => userTags.includes(tag))
        );
        setPersonalizedCourses(filteredCourses);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, [user]);

  const handleCloseDialog = () => {
    setSelectedCourse(null);
  };

  const handlePaymentSuccess = () => {
    setPaidCourses((prev) => [...prev, selectedCourse.id]);
    alert("Payment successful! You can now view the course.");
  };

  if (!user) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1">You must be logged in.</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "1rem" }}
          href="/login"
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Personalized Courses for You
      </Typography>
      {personalizedCourses.length > 0 ? (
        <Box container spacing={3}>
          {personalizedCourses.map((course) => (
            <Box item xs={12} sm={6} md={4} key={course.id}>
              <Paper elevation={3} sx={{ padding: "1.5rem", borderRadius: "8px" }}>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.description.substring(0, 100)}...
                </Typography>
                <Chip
                  label={course.difficulty_level}
                  color={
                    course.difficulty_level === "Beginner"
                      ? "success"
                      : course.difficulty_level === "Intermediate"
                      ? "warning"
                      : "error"
                  }
                  sx={{ marginBottom: "0.5rem" }}
                />
                <Typography variant="body2" color="text.secondary">
                  Instructor: {course.instructor}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ marginTop: "1rem" }}
                  onClick={() => setSelectedCourse(course)}
                >
                  Learn More
                </Button>
              </Paper>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary">
          No personalized courses match your tags. Explore all available courses
          below.
        </Typography>
      )}

      <Typography variant="h5" gutterBottom sx={{ marginTop: "2rem" }}>
        All Courses
      </Typography>
      <Box container spacing={3}>
        {courses.map((course) => (
          <Box item xs={12} sm={6} md={4} key={course.id}>
            <Paper elevation={3} sx={{ padding: "1.5rem", borderRadius: "8px" }}>
              <Typography variant="h6" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {course.description.substring(0, 100)}...
              </Typography>
              <Chip
                label={course.difficulty_level}
                color={
                  course.difficulty_level === "Beginner"
                    ? "success"
                    : course.difficulty_level === "Intermediate"
                    ? "warning"
                    : "error"
                }
                sx={{ marginBottom: "0.5rem" }}
              />
              <Typography variant="body2" color="text.secondary">
                Instructor: {course.instructor}
              </Typography>
              <Button
                component={Link}
                to={`/courses/${course.id}`}
                variant="outlined"
                color="primary"
                sx={{ marginTop: "1rem" }}
              >
                Learn More
              </Button>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Courses;
