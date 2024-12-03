import React, { useState } from "react";
import { Box, TextField, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MentorLogin = ({setMentor}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/mentor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Login successful!");
        localStorage.setItem("mentorToken", data.access_token); // Store token in local storage
        console.log(data)
        setMentor(data.user);
        navigate("/mentor/center");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Mentor Login
      </Typography>
      <Stack spacing={2}>
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
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Stack>
    </Box>
  );
};

export default MentorLogin;
