import {useState} from "react";
import GroupSession from "./sessions/GroupSession";
import { Box, Typography, Button, Chip } from '@mui/material'

const UserAccount = ({ user }) => {
  console.log(user?.tags)

  if (!user) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1">
          You must be logged in.
        </Typography>
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

  // Process tags
  let tags = [];
  try {
    // Remove the brackets and quotes and split into an array
    tags = user.tags
      .replace(/^\[|]$/g, "") // Remove leading and trailing brackets
      .split(",") // Split by commas
      .map((tag) => tag.replace(/"|'/g, "").trim()); // Remove quotes and trim whitespace
  } catch (err) {
    console.error("Failed to process tags:", err);
    tags = [];
  }

  console.log("Processed tags", tags)
  return (
    <Box sx={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Your Account
      </Typography>
      <Typography variant="body1">
        <strong>Name:</strong> {user.name}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {user.email}
      </Typography>
      <Typography variant="h6" sx={{ marginTop: "1rem" }}>
        Skills
      </Typography>
      <Box>
        {tags.length > 0 && tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            color="primary"
            sx={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
            />
        ))}
      </Box>
    </Box>
  );
};

export default UserAccount;
