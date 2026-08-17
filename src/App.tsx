import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

import { Landing } from './pages/public/Landing';
import { HowItWorks } from './pages/public/HowItWorks';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';

import { Dashboard } from './pages/athlete/Dashboard';
import { Profile } from './pages/athlete/Profile';
import { AssessmentFlow } from './pages/athlete/AssessmentFlow';
import { Result } from './pages/athlete/Result';

import { Dashboard as OfficialDashboard } from './pages/official/Dashboard';

const NotFound = () => <div className="p-8 text-center"><h1>404 - Page Not Found</h1></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Landing />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Athlete Routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assessments" element={<AssessmentFlow />} />
          <Route path="result/:id" element={<Result />} />
          
          {/* Official Routes */}
          <Route path="official" element={<OfficialDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
