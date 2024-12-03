import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";

const LessonPlan = ({ studentId, user }) => {
  const [lessonPlan, setLessonPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLessonPlan = async () => {
    setLoading(true)
    try{
      const response = await fetch("http://localhost:5000/api/lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tags: user.tags
        }),
      });
      if(response.ok){
        const data = await response.json()
        console.log(data)
        setLessonPlan(data)
      } else {
        console.error("Failed to fetch lesson plan")
      } 
    } catch(err){
      console.error("Error fetching lesson plan:", err);
    } finally{
      setLoading(false)
    }

  }

  useEffect(() => {
    if (!user) return;
    fetchLessonPlan()
  }, []);

  if (!user) {
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
          href="/login"
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="h5">Generating your personalized lesson plan...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Your Personalized Lesson Plan
      </Typography>

      {lessonPlan ? (
        <>
          <Typography variant="h5" gutterBottom>
            Unit Outline
          </Typography>
          <Paper sx={{ padding: "1rem", marginBottom: "2rem" }}>
            {lessonPlan.units.map((unit, index) => (
              <Box key={index} sx={{ marginBottom: "1rem" }}>
                <Typography variant="h6">{unit.title}</Typography>
                <Typography variant="body1">{unit.description}</Typography>
              </Box>
            ))}
          </Paper>

          <Divider sx={{ margin: "2rem 0" }} />

          <Typography variant="h5" gutterBottom>
            Lesson Plans
          </Typography>
          <List>
            {lessonPlan.supplemental_plan}
          </List>

          <Divider sx={{ margin: "2rem 0" }} />

        </>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No lesson plan available. Please try again later.
        </Typography>
      )}
    </Box>
  );
};

export default LessonPlan;
