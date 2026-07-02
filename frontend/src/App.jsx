import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Explore from './pages/Explore.jsx';
import ArtworkDetails from './pages/ArtworkDetails.jsx';
import ArtistProfile from './pages/ArtistProfile.jsx';

// Auth Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// Dashboard Pages
import DashboardOverview from './pages/DashboardOverview.jsx';
import DashboardUpload from './pages/DashboardUpload.jsx';
import DashboardGallery from './pages/DashboardGallery.jsx';
import DashboardMessages from './pages/DashboardMessages.jsx';
import DashboardNotifications from './pages/DashboardNotifications.jsx';
import DashboardSettings from './pages/DashboardSettings.jsx';

// Admin Page
import AdminDashboard from './pages/AdminDashboard.jsx';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* 1. PUBLIC PLATFORM ROUTER */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Landing />} />
              <Route path="explore" element={<Explore />} />
              <Route path="artwork/:id" element={<ArtworkDetails />} />
              <Route path="artist/:username" element={<ArtistProfile />} />
              
              {/* Auth endpoints */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>

            {/* 2. PRIVATE ARTIST DASHBOARD */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="upload" element={<DashboardUpload />} />
              <Route path="gallery" element={<DashboardGallery />} />
              <Route path="messages" element={<DashboardMessages />} />
              <Route path="notifications" element={<DashboardNotifications />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>

            {/* 3. ADMINISTRATION DASHBOARD */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Fallback Catch-All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
