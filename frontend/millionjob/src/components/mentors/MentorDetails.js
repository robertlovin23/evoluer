import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Chip, Avatar, Button, Grid, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const MentorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch mentor details
    fetch(`http://localhost:5000/api/mentors/${id}`)
      .then((response) => response.json())
      .then((data) => setMentor(data))
      .catch((error) => console.error("Error fetching mentor:", error));

    // Fetch mentor courses
    fetch(`http://localhost:5000/api/courses`)
      .then((response) => response.json())
      .then((data) => {
        const mentorCourses = data.courses.filter((course) => course.mentor_id === parseInt(id));
        setCourses(mentorCourses);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, [id]);

  if (!mentor) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Button onClick={() => navigate(-1)} color="primary" sx={{ marginBottom: "1rem" }}>
        Back
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Avatar
            sx={{
              width: 128,
              height: 128,
              margin: "0 auto",
              bgcolor: "primary.light",
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" align="center" sx={{ marginTop: "1rem" }}>
            {mentor.name}
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ marginTop: "0.5rem" }}>
            {mentor.bio}
          </Typography>
          <Box sx={{ marginTop: "1rem", textAlign: "center" }}>
            {mentor.expertise.map((tag, index) => (
              <Chip key={index} label={tag} color="primary" sx={{ margin: "0.2rem" }} />
            ))}
          </Box>
          <Typography variant="body1" sx={{ marginTop: "1rem", textAlign: "center" }}>
            <strong>Price:</strong> ${mentor.price} per session
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Courses by {mentor.name}
          </Typography>
          {courses.length > 0 ? (
            courses.map((course) => (
              <Paper key={course.id} sx={{ padding: "1rem", marginBottom: "1rem" }}>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <Chip label={course.difficulty_level} color="primary" sx={{ marginTop: "0.5rem" }} />
              </Paper>
            ))
          ) : (
            <Typography>No courses available for this mentor.</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MentorDetails;
