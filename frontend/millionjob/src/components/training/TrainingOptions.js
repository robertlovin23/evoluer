import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";

const TrainingOptions = () => {
  const { state } = useLocation();
  const { mentors, courses } = state || { mentors: [], courses: [] };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Training Options
      </Typography>

      <Typography variant="h5" gutterBottom>
        Mentors
      </Typography>
      <Grid container spacing={3}>
        {mentors.map((mentor) => (
          <Grid item xs={12} sm={6} md={4} key={mentor.id}>
            <Paper elevation={2} sx={{ padding: "1rem" }}>
              <Typography variant="h6">{mentor.name}</Typography>
              <Typography>{mentor.expertise.join(", ")}</Typography>
              <Typography color="textSecondary">Price: ${mentor.price}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ marginTop: "2rem" }}>
        Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Paper elevation={2} sx={{ padding: "1rem" }}>
              <Typography variant="h6">{course.title}</Typography>
              <Typography>{course.provider}</Typography>
              <Typography color="textSecondary">Price: ${course.price}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TrainingOptions;
