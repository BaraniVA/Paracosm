import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { NotificationProvider } from './hooks/useNotifications';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { CreateWorld } from './pages/CreateWorld';
import { WorldDashboard } from './pages/WorldDashboard';
import { WorldView } from './pages/WorldView';
import { CommunityPostDetail } from './pages/CommunityPostDetail';
import { Profile } from './pages/Profile';
import { ExploreWorlds } from './pages/ExploreWorlds';
import { HelpCenter } from './pages/HelpCenter';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { QuickStartGuide } from './pages/QuickStartGuide';
import { GettingStartedGuide } from './pages/GettingStartedGuide';
import { CollaborationGuide } from './pages/CollaborationGuide';
import { WorldManagementGuide } from './pages/WorldManagementGuide';
import { Chronicle } from './pages/Chronicle';

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
    <NotificationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/explore" element={<ExploreWorlds />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/help/getting-started" element={<GettingStartedGuide />} />
            <Route path="/help/collaboration" element={<CollaborationGuide />} />
            <Route path="/help/world-management" element={<WorldManagementGuide />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/quick-start" element={<QuickStartGuide />} />
            <Route
              path="/chronicle"
              element={user ? <Chronicle /> : <Navigate to="/login" />}
            />
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
              element={<WorldView />}
            />
            <Route
              path="/world/:worldId/community/:postId"
              element={<CommunityPostDetail />}
            />
            <Route
              path="/profile/:userId"
              element={<Profile />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
            />
          </Routes>
        </Layout>
      </Router>
    </NotificationProvider>
  );
}

export default App;