import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './global.css';
import Dashboard from '@pages/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
