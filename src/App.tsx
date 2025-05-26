import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
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
            <Route path="/destination/:slug" element={<DestinationDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Profile Routes */}
            <Route path="/profile/trips" element={<Trips />} />
            <Route path="/profile/saved" element={<SavedPlaces />} />
            <Route path="/profile/settings" element={<Settings />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/destinations/add" element={<AddDestination />} />
            <Route path="/admin/destinations/edit/:id" element={<EditDestination />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;