import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { CreateWorld } from './pages/CreateWorld';
import { WorldDashboard } from './pages/WorldDashboard';
import { WorldView } from './pages/WorldView';
import { CommunityPostDetail } from './pages/CommunityPostDetail';
import { Profile } from './pages/Profile';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route
            path="/create-world"
            element={user ? <CreateWorld /> : <Navigate to="/login" />}
          />
          <Route
            path="/world/:worldId/dashboard"
            element={user ? <WorldDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/world/:worldId"
            element={user ? <WorldView /> : <Navigate to="/login" />}
          />
          <Route
            path="/world/:worldId/community/:postId"
            element={user ? <CommunityPostDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;