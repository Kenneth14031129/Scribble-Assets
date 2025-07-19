import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Assets from "./Equipments/AllAssets.jsx";
import Disposed from "./Disposed.jsx";
import Profile from "./Profile.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/disposed" element={<Disposed />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  </StrictMode>
);
