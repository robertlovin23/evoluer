import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const MentorEdit = ({ mentor }) => {
  const navigate = useNavigate();
  const [mentorData, setMentorData] = useState({
    name: "",
    email: "",
    price: "",
    bio: "",
    password: "",
    expertise: "",
    availability: "",
    calendarLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get mentorId from prop or fallback to null
  const mentorId = mentor?.id;

  useEffect(() => {
    if (!mentorId) {
      setError("Mentor ID is missing.");
      setLoading(false);
      return;
    }

    // Fetch mentor details
    fetch(`http://localhost:5000/api/mentors/${mentorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setMentorData({
            ...data,
            expertise: data.expertise.join(", "), // Convert array to comma-separated string
          });
        }
      })
      .catch((err) => setError("Failed to fetch mentor details"))
      .finally(() => setLoading(false));
  }, [mentorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMentorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const updatedData = { ...mentorData };
  
    // Remove password field if it's empty
    if (!updatedData.password) {
      delete updatedData.password;
    }
  
    updatedData.expertise = mentorData.expertise.split(",").map((tag) => tag.trim());
  
    try {
      const response = await fetch(`http://localhost:5000/api/mentor/${mentorId}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setError(result.error || "Failed to update mentor details.");
      } else {
        alert("Mentor details updated successfully!");
        navigate(`/mentor/center`);
      }
    } catch (err) {
      setError("An error occurred while updating mentor details.");
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "2rem" }}>
        <CircularProgress />
        <Typography>Loading mentor details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: "2rem", marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Edit Mentor Details
        </Typography>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                fullWidth
                value={mentorData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                type="email"
                value={mentorData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="bio"
                label="Biography"
                fullWidth
                type="bio"
                value={mentorData.bio}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="price"
                label="Price (per session)"
                fullWidth
                type="number"
                value={mentorData.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
                name="password"
                label="Password (leave blank to keep current)"
                fullWidth
                type="password"
                value={mentorData.password}
                onChange={handleInputChange}
                />

            </Grid>
            <Grid item xs={12}>
              <TextField
                name="expertise"
                label="Expertise (comma-separated)"
                fullWidth
                value={mentorData.expertise}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="availability"
                label="Availability"
                fullWidth
                value={mentorData.availability}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="calendarLink"
                label="Calendar Link"
                fullWidth
                value={mentorData.calendarLink}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default MentorEdit;
