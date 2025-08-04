import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Applicants from './pages/Applicants';
import AddApplicant from './pages/AddApplicant';
import Requirements from './pages/Requirements';
import Reports from './pages/Reports';
import Timesheets from './pages/Timesheets';
import PostJob from './pages/PostJob';
import CandidateTimesheet from './pages/CandidateTimesheet';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicants"
            element={
              <ProtectedRoute>
                <Layout>
                  <Applicants />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicants/add"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddApplicant />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/requirements"
            element={
              <ProtectedRoute>
                <Layout>
                  <Requirements />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/requirements/post"
            element={
              <ProtectedRoute>
                <Layout>
                  <PostJob />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/timesheets"
            element={
              <ProtectedRoute>
                <Layout>
                  <Timesheets />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/timesheets/candidate/:candidateId"
            element={
              <ProtectedRoute>
                <CandidateTimesheet />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
