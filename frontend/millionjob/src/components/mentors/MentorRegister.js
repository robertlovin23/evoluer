import React, { useState } from "react";
import { Box, TextField, Typography, Button, Stack } from "@mui/material";

const MentorRegister = ({setMentor}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expertise, setExpertise] = useState("");
  const [calendarLink, setCalendarLink] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/mentor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          expertise: expertise.split(",").map((item) => item.trim()),
          calendarLink,
        }),
      });

      if (response.ok) {
        alert("Registration successful! You can now log in.");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Mentor Registration
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Expertise (comma-separated)"
          variant="outlined"
          fullWidth
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
        />
        <TextField
          label="Calendar Link (e.g., Calendly)"
          variant="outlined"
          fullWidth
          value={calendarLink}
          onChange={(e) => setCalendarLink(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleRegister}>
          Register
        </Button>
      </Stack>
    </Box>
  );
};

export default MentorRegister;
