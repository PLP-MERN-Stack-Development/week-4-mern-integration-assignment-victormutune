import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

const AuthForm = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'register') {
        await authService.register({ username, email, password });
        navigate('/login');
      } else {
        await authService.login({ email, password });
        navigate(location.state?.from || '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      {error && <div className="error">{error}</div>}
      {mode === 'register' && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">{mode === 'register' ? 'Register' : 'Login'}</button>
    </form>
  );
};

export default AuthForm;
