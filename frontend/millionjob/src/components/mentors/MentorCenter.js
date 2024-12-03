import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";

const MentorCenter = ({ mentor }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (mentor) {
      fetch(`http://localhost:5000/api/courses`)
        .then((res) => res.json())
        .then((data) => {
          const mentorCourses = data.courses.filter(
            (course) => course.mentor_id === mentor.id
          );
          setCourses(mentorCourses);
        })
        .catch((error) => console.error("Error fetching courses:", error));
    }
  }, [mentor]);

  if (!mentor) {
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
          href="/mentor/login"
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Mentor Profile Section */}
      <Card sx={{ marginBottom: "2rem", padding: "1rem", display: "flex" }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            marginRight: "1rem",
            bgcolor: "primary.light",
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h5" gutterBottom>
            {mentor.name}'s Profile
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Bio:</strong> {mentor.bio || "No bio available"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Expertise:</strong>
          </Typography>
          <Box>
            {mentor.expertise.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                color="primary"
                sx={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
              />
            ))}
          </Box>
        </Box>
      </Card>

      <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/mentor-details/${mentor.id}/edit`)}
            sx={{ marginBottom: "2rem", marginRight: "1rem"  }}
        >
            Edit Mentor Details
        </Button>

      {/* Create Course Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/mentor/create-course")}
        sx={{ marginBottom: "2rem" }}
      >
        Create New Course
      </Button>

      {/* Courses Section */}
      <Typography variant="h5" gutterBottom>
        Your Courses
      </Typography>
      {courses.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            paddingBottom: "1rem",
            gap: "1rem",
          }}
        >
          {courses.map((course) => (
            <Card
              key={course.id}
              sx={{
                minWidth: "300px",
                maxWidth: "300px",
                boxShadow: 3,
                flexShrink: 0,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.description.substring(0, 100)}...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Difficulty:</strong> {course.difficulty_level}
                </Typography>
                <Box sx={{ marginTop: "1rem" }}>
                  <video
                    src={course.video_path}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      marginTop: "0.5rem",
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No courses created yet.
        </Typography>
      )}
    </Box>
  );
};

export default MentorCenter;
