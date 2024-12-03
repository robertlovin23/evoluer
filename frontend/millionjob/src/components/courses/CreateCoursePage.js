import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import VideoComponent from "../video/VideoComponent";
import { useNavigate } from "react-router-dom";

const CreateCoursePage = ({ mentor }) => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    difficulty_level: "",
    duration: "",
    tags: "",
  });
  const [videoPath, setVideoPath] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!mentor || !videoPath) {
      alert("Please upload a video and ensure you are logged in.");
      return;
    }

    try {
      const formData = new FormData();
      const uniqueFilename = `recording_${Date.now()}.webm`;
      formData.append("video", videoPath, uniqueFilename);

      const uploadResponse = await fetch("http://localhost:5000/api/upload-video", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        alert(`Failed to upload video: ${error.error}`);
        return;
      }

      const { video_url } = await uploadResponse.json();

      const payload = {
        mentor_id: mentor.id,
        title: courseData.title,
        description: courseData.description,
        difficulty_level: courseData.difficulty_level,
        duration: parseInt(courseData.duration),
        video_path: video_url,
        tags: courseData.tags.split(",").map((tag) => tag.trim()),
      };

      const response = await fetch("http://localhost:5000/api/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Course created successfully!");
        navigate("/mentor/center"); // Redirect back to Mentor Center
      } else {
        const error = await response.json();
        alert(`Failed to create course: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("An error occurred while creating the course.");
    }
  };
  
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
    <Box sx={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create a New Course
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Course Fields */}
            <TextField
              name="title"
              label="Course Title"
              value={courseData.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="description"
              label="Course Description"
              value={courseData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={3}
            />
            <TextField
              name="difficulty_level"
              label="Difficulty Level (e.g., Beginner, Intermediate, Advanced)"
              value={courseData.difficulty_level}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="duration"
              label="Duration (in hours)"
              value={courseData.duration}
              onChange={handleInputChange}
              type="number"
              required
            />
            <TextField
              name="tags"
              label="Tags (comma-separated)"
              value={courseData.tags}
              onChange={handleInputChange}
            />
          </Box>

          {/* Video Upload */}
          <Typography variant="h6" gutterBottom sx={{ marginTop: "1.5rem" }}>
            Upload Course Video
          </Typography>
          <VideoComponent onVideoUpload={setVideoPath} />

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "2rem" }}
            onClick={handleSubmit}
          >
            Submit Course
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ marginTop: "1rem", marginLeft: "1rem" }}
            onClick={() => navigate("/mentor/center")}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateCoursePage;
