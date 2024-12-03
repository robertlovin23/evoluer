import React from "react";
import { Box, Typography, Button, Paper, Avatar } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          padding: "4rem 2rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        FutureProof Your Career
      </Typography>
      <Typography variant="h5" gutterBottom>
        Discover sustainable, human-centric job opportunities that thrive in a post-AI world.
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "2rem" }}>
        Embrace the future with careers that focus on creativity, communication, and empathy—qualities only humans can provide.
      </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ marginTop: "1rem" }}
          component={Link}
          to="/register"
        >
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "4rem",
        }}
      >
        {/* Job Opportunities */}
        <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "8px" }}>
          <WorkIcon sx={{ fontSize: "3rem", color: "primary.main" }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Job Opportunities
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover and apply for AI-proof jobs tailored to your skills and
            experience.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginTop: "1rem" }}
            component={Link}
            to="/jobs"
          >
            Browse Jobs
          </Button>
        </Paper>

        {/* Learn & Grow */}
        <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "8px" }}>
          <SchoolIcon sx={{ fontSize: "3rem", color: "secondary.main" }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Learn & Grow
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Access courses and mentorship to improve your social and technical
            skills.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginTop: "1rem" }}
            component={Link}
            to="/courses"
          >
            Start Learning
          </Button>
        </Paper>

        {/* Mentorship */}
        <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "8px" }}>
          <GroupIcon sx={{ fontSize: "3rem", color: "primary.light" }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Mentorship
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connect with mentors who can guide you through your career
            journey.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginTop: "1rem" }}
            component={Link}
            to="/mentors"
          >
            Find a Mentor
          </Button>
        </Paper>
      </Box>

      {/* Testimonial Section */}
      <Box
        sx={{
          padding: "2rem",
          textAlign: "center",
          marginBottom: "4rem",
          backgroundColor: "background.default",
          borderRadius: "8px",
        }}
      >
      </Box>

      {/* Call-to-Action Banner */}
      <Box
        sx={{
          textAlign: "center",
          padding: "3rem",
          backgroundColor: "secondary.main",
          color: "white",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to Start Your Journey?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Join thousands of users building their future with our platform.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ marginTop: "1rem" }}
          component={Link}
          to="/register"
        >
          Join Now
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
