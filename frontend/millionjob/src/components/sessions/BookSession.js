import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const BookSession = ({ studentId, mentorId, user }) => {
  const [schedule, setSchedule] = useState("");

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5000/api/mentorship_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_id: studentId,
        mentor_id: mentorId,
        schedule,
      }),
    });

    if (response.ok) {
      alert("Session booked successfully!");
    } else {
      alert("Failed to book session.");
    }
  };

  if(user){
    return (
        <div>
          <TextField
            label="Schedule (e.g., 2024-11-30T15:00)"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Book Session
          </Button>
        </div>
      );
  } else {
    <div>
        Please login first
    </div>
  }

};

export default BookSession;
