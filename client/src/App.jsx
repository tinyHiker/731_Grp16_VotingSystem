import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BallotPage from './pages/BallotPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [voter, setVoter] = useState(() => {
    const v = localStorage.getItem('voter');
    return v ? JSON.parse(v) : null;
  });

  const navigate = useNavigate();

  const handleLogin = (token, voter) => {
    setToken(token);
    setVoter(voter);
    localStorage.setItem('token', token);
    localStorage.setItem('voter', JSON.stringify(voter));
    navigate('/ballot');
  };

  const handleLogout = () => {
    setToken(null);
    setVoter(null);
    localStorage.removeItem('token');
    localStorage.removeItem('voter');
    navigate('/login');
  };

  // If token disappears for some reason, kick out
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const isAuthenticated = !!token;

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5' }}>
      <header
        style={{
          background: '#1e293b',
          color: 'white',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontWeight: 'bold' }}>Online Voting System</span>
          {voter && (
            <span style={{ marginLeft: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
              Logged in as {voter.name} ({voter.idNumber})
            </span>
          )}
        </div>
        <nav style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {isAuthenticated && (
            <>
              <Link style={{ color: 'white', textDecoration: 'none' }} to="/ballot">
                Ballot
              </Link>
              <Link style={{ color: 'white', textDecoration: 'none' }} to="/results">
                Results
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: '1rem',
                  padding: '0.25rem 0.75rem',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main style={{ padding: '1.5rem' }}>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/ballot"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BallotPage voter={voter} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/ballot' : '/login'} replace />}
          />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </div>
  );
}

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;
