import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const JobsPage = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
    jobtitle:"",
    country: "US",
    maxAgeDays: 15,
    page: 0,
    limit: 10,
  });
  const navigate = useNavigate();

  const handleTrainMe = async (jobDescription) => {
    const keywords = extractKeywords(jobDescription); // Extract keywords from the job description
  
    try {
      // Fetch relevant mentors
      const mentorsResponse = await fetch("http://localhost:5000/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });
      const mentors = await mentorsResponse.json();
  
      // Fetch relevant courses
      const coursesResponse = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });
      const courses = await coursesResponse.json();
  
      // Navigate to a new page showing mentors and courses
      navigate("/training-options", { state: { mentors, courses } });
    } catch (error) {
      console.error("Failed to fetch training options:", error);
    }
  };
  
  const extractKeywords = (description) => {
    // Naive keyword extraction (improve with NLP if needed)
    const stopWords = ["the", "and", "of", "to", "a", "in", "is", "with", "for"];
    return description
      .split(/\W+/)
      .filter((word) => word.length > 3 && !stopWords.includes(word.toLowerCase()))
      .slice(0, 10); // Limit to 10 keywords
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_JOBS_API_ACCESS_TOKEN}`, // Replace <api_key> with your actual API key
        },
        body: JSON.stringify({
          page: filters.page,
          limit: filters.limit,
          posted_at_max_age_days: filters.maxAgeDays,
          order_by: [{ desc: true, field: "date_posted" }],
          job_title_or: [filters.jobtitle],
          job_country_code_or: [filters.country],
          include_total_results: false,
          blur_company_data: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setJobs(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Container maxWidth="lg" sx={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Job Listings
      </Typography>
      <Paper elevation={3} sx={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Job Title"
              name="jobtitle"
              value={filters.jobtitle}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Keyword"
              name="keyword"
              value={filters.keyword}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Country Code"
              name="country"
              value={filters.country}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Max Age (Days)"
              name="maxAgeDays"
              value={filters.maxAgeDays}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Results Per Page"
              name="limit"
              value={filters.limit}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchJobs}
          sx={{ marginTop: "1rem" }}
          disabled={loading}
        >
          Search Jobs
        </Button>
      </Paper>
      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" sx={{ marginBottom: "1rem" }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={2}>
      {jobs?.map((job) => (
  <Grid item xs={12} key={job.id}>
    <Paper elevation={3} sx={{ padding: "1.5rem", marginBottom: "1rem" }}>
      <Typography variant="h5" gutterBottom>
        {job.job_title} -{" "}
        <Typography variant="subtitle1" component="span" color="textSecondary">
          {job.seniority}
        </Typography>
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Typography variant="body1">
          <strong>Company:</strong> {job.company || "Unknown"}
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> {job.long_location || "Remote"}
        </Typography>
      </Box>

      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: "0.5rem" }}>
        <strong>Posted on:</strong> {new Date(job.date_posted).toLocaleDateString()}
      </Typography>

      <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
        <strong>Salary:</strong> {job.salary_string || "Not specified"}
      </Typography>

      <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
        {job.description}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        {job.employment_statuses && (
          <Typography variant="body2" sx={{ marginRight: "1rem" }}>
            <strong>Employment:</strong> {job.employment_statuses.join(", ")}
          </Typography>
        )}
        {job.hybrid && (
          <Typography variant="body2" sx={{ marginRight: "1rem" }}>
            <strong>Hybrid:</strong> Yes
          </Typography>
        )}
        <Typography variant="body2">
          <strong>Industry:</strong> {job.company_object?.industry || "N/A"}
        </Typography>
      </Box>

      <Box sx={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          href={job.url || job.final_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Job Posting
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleTrainMe(job.description)}
        >
          Train Me
        </Button>
      </Box>
    </Paper>
  </Grid>
))}


      </Grid>
    </Container>
  );
};

export default JobsPage;
