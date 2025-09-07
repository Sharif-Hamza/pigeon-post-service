import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import TrackingPage from '@/components/TrackingPage';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import MessageView from '@/components/MessageView';
import ProtectedRoute from '@/components/ProtectedRoute';
import { TrackingProvider } from '@/context/TrackingContext';
import './App.css';

function App() {
  return (
    <TrackingProvider>
      <Router>
        <div className="min-h-screen bg-vintage-paper bg-cover bg-fixed">
          <Routes>
            <Route path="/" element={<TrackingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/message/:trackingNumber" element={<MessageView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </TrackingProvider>
  );
}

export default App;