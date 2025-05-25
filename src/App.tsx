import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Groups from './pages/Groups';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Dashboard from './pages/admin/Dashboard';
import AddDestination from './pages/admin/AddDestination';
import EditDestination from './pages/admin/EditDestination';

// Profile pages
import Trips from './pages/profile/Trips';
import SavedPlaces from './pages/profile/SavedPlaces';
import Settings from './pages/profile/Settings';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:category" element={<Destinations />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Profile Routes */}
            <Route path="/profile">
              <Route path="trips" element={<Trips />} />
              <Route path="saved" element={<SavedPlaces />} />
              <Route path="settings" element={<Settings />} />
              <Route index element={<Navigate to="/profile/trips" replace />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="destinations/add" element={<AddDestination />} />
              <Route path="destinations/edit/:id" element={<EditDestination />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;