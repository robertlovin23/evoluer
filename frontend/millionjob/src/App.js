import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserAccount from "./components/UserAccount";
import BookSession from "./components/sessions/BookSession";
import MentorCenter from "./components/mentors/MentorCenter";
import Home from "./components/Home";
import Courses from "./components/courses/Courses";
import MentorRegister from "./components/mentors/MentorRegister";
import MentorLogin from "./components/mentors/MentorLogin";
import CourseDetails from "./components/courses/CourseDetails";
import MentorDetails from "./components/mentors/MentorDetails";
import CreateCoursePage from "./components/courses/CreateCoursePage";
import MentorEdit from "./components/mentors/MentorEdit";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MentorSelection from "./components/mentors/MentorSelection";
import LessonPlan from "./components/learning-plans/LessonPlan";
import JobsPage from "./components/jobs/Jobs";

const App = () => {
  const [user, setUser] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
  };

  const handleMentorLogout = () => {
    localStorage.removeItem("jwt");
    setMentor(null);
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Million Jobs
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
          {user && (
            <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
          )}
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/">
            Home
          </MenuItem>
          {user && (
          <MenuItem onClick={handleMenuClose} component={Link} to="/courses">
            Take a Course
          </MenuItem>
          )}
          {user && (
          <MenuItem onClick={handleMenuClose} component={Link} to="/mentors">
            Get Help From a Mentor
          </MenuItem>
          )}
          {user && (
          <MenuItem onClick={handleMenuClose} component={Link} to="/jobs">
            Find Jobs
          </MenuItem>
          )}
          {user && (
            <MenuItem onClick={handleMenuClose} component={Link} to="/account">
              My Account
            </MenuItem>
          )}
          {/* {user && (
            <MenuItem onClick={handleMenuClose} component={Link} to="/lessonplan">
              Generate Lesson Plan
            </MenuItem>
          )} */}
        </Menu>
      </AppBar>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<UserAccount user={user} />} />
        <Route path="/sessions" element={<BookSession user={user}/>}/>
        <Route path="/mentors" element={<MentorSelection user={user}/>}/>
        <Route path="/mentor/center" element={<MentorCenter mentor={mentor} />} />
        <Route path="/mentor/register" element={<MentorRegister mentor={mentor}/>} />
        <Route path="/mentor/login" element={<MentorLogin setMentor={setMentor}/>} />
        <Route path="/courses/:courseId" element={<CourseDetails user={user} />} />
        <Route path="/mentor/create-course" element={<CreateCoursePage mentor={mentor} />} />
        <Route path="/mentor-details/:id" element={<MentorDetails mentor={mentor}/>} />
        <Route path="/mentor-details/:id/edit" element={<MentorEdit mentor={mentor}/>} />
        <Route path="/lessonplan" element={<LessonPlan user={user}/>}/>
        <Route path="/courses" element={<Courses user={user}/>}/>
        <Route path="/jobs" element={<JobsPage user={user}/>}/>
      </Routes>
    </Router>
  );
};

export default App;
