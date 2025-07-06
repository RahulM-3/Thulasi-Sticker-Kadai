import React, { useState } from 'react';
import './Loginsignup.css';

function Loginsignup() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignIn) {
      setMessage('Sign-in not implemented yet.');
      setMessageColor('orange');
    } else {
      try {
        const result = await window.firebaseAPI.signupUser(username, password);
        setMessage(result.data.message);
        setMessageColor(result.data.success ? 'green' : 'red');
      } catch (err) {
        setMessage('Signup failed: ' + err.message);
        setMessageColor('red');
      }
    }
  };

  return (
    <div id="auth-container">
      <form id="signin-form" onSubmit={handleSubmit}>
        <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div id="password-wrapper">
          <label htmlFor="password">Password</label>
          {isSignIn && <a href="#" id="forgot-link">Forgot password?</a>}
        </div>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</button>

        <p id="switch-auth">
          {isSignIn ? 'New to Sticker Kadai?' : 'Already have an account?'}
          <button type="button" id="switch-to-signup" onClick={handleToggle}>
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        {message && (
          <label style={{ color: messageColor, marginTop: '10px', display: 'block' }}>
            {message}
          </label>
        )}
      </form>
    </div>
  );
}

export default Loginsignup;