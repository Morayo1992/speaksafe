import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitReport from './pages/SubmitReport';
import ActionPlan from './pages/ActionPlan';
import Resources from './pages/Resources';
import RetrieveEvidence from './pages/RetrieveEvidence';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitReport />} />
        <Route path="/action-plan/:accessCode" element={<ActionPlan />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/retrieve" element={<RetrieveEvidence />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
