import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Chip,
  Stack,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleRegister = async () => {
    const userData = { name, email, password, tags };
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Registration successful!");
        console.log("User registered:", data);
        navigate("/"); // Redirect to home
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <TextField
        fullWidth
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" gutterBottom>
          Tags (Skills/Interests)
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              color="primary"
            />
          ))}
        </Stack>
        <TextField
          fullWidth
          label="Add a tag"
          variant="outlined"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={handleAddTag} variant="contained">
                  Add
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleRegister}
      >
        Register
      </Button>
    </Box>
  );
};

export default Register;
