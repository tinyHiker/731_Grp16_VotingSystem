import React from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idNumber: '',
      password: '',
      error: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  // 🧪 Method you can test: updates idNumber and clears error
  handleIdChange(e) {
    this.setState({
      idNumber: e.target.value,
      error: '',
    });
  }

  // 🧪 Method you can test: updates password and clears error
  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
      error: '',
    });
  }

  // 🧪 Method you can test: performs login request + calls onLogin
  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ error: '' });

    const { idNumber, password } = this.state;
    const { onLogin } = this.props;

    try {
      const res = await api.post('/api/auth/login', { idNumber, password });
      const { token, voter } = res.data;
      onLogin(token, voter);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Login failed';
      this.setState({ error: msg });
    }
  }

  render() {
    const { isAuthenticated } = this.props;
    const { idNumber, password, error } = this.state;

    if (isAuthenticated) {
      return <Navigate to="/ballot" replace />;
    }

    return (
      <div
        style={{
          maxWidth: '400px',
          margin: '2rem auto',
          padding: '2rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Voter Login</h2>
        <p
          style={{
            fontSize: '0.9rem',
            marginBottom: '1rem',
            color: '#555',
          }}
        >
          Use the ID number and password that were sent to you.
        </p>

        {error && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '4px',
              background: '#fee2e2',
              color: '#b91c1c',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={this.handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            ID Number
            <input
              type="text"
              value={idNumber}
              onChange={this.handleIdChange}
              style={inputStyle}
              required
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.75rem' }}>
            Password
            <input
              type="password"
              value={password}
              onChange={this.handlePasswordChange}
              style={inputStyle}
              required
            />
          </label>

          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
      </div>
    );
  }
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  marginTop: '0.25rem',
  marginBottom: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #cbd5e1',
};

const buttonStyle = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: 'none',
  background: '#2563eb',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default LoginPage;
