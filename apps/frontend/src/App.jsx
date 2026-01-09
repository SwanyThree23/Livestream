import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LiveStudio from './pages/LiveStudio';
import AIPodcastStudio from './pages/AIPodcastStudio';
import AvatarStudio from './pages/AvatarStudio';
import FanbaseHub from './pages/FanbaseHub';
import UniversalChat from './pages/UniversalChat';
import Monetization from './pages/Monetization';
import ContentLibrary from './pages/ContentLibrary';
import Marketplace from './pages/Marketplace';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';

/**
 * Protected Route wrapper
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Main App component
 */
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="studio" element={<LiveStudio />} />
        <Route path="podcast" element={<AIPodcastStudio />} />
        <Route path="avatar" element={<AvatarStudio />} />
        <Route path="fanbase" element={<FanbaseHub />} />
        <Route path="chat" element={<UniversalChat />} />
        <Route path="monetization" element={<Monetization />} />
        <Route path="content" element={<ContentLibrary />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
