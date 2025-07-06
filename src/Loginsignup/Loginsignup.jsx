import React, { useState } from 'react';
import './Loginsignup.css';
import { useFormState } from 'react-dom';

function Loginsignup() {
  const [signedIn, setSignedIn] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignIn) {
      try {
        const result = await window.firebaseAPI.signinUser(username, password);
        if(result.data.success) {
          setSignedIn(username)
        }
        setMessage(result.data.message);
      } 
      catch (err) {
        setMessage('Signin failed: ' + err.message);
      }
    } 
    else {
      try {
        const result = await window.firebaseAPI.signupUser(username, password);
        if(result.data.success) {
          setSignedIn(username)
        }
        setMessage(result.data.message);
      }
      catch (err) {
        setMessage('Signup failed: ' + err.message);
      }
    }
  };

  if(!signedIn) {
    return(
    <div id="auth-container">
        <form id="signin-form" onSubmit={ handleSubmit }>
          <h2>{ isSignIn ? 'Sign In' : 'Sign Up'}</h2 >

          <div id="username-wrapper">
            <label htmlFor="username">Username</label>  
            { (message === "Username already taken" || message === "User does not exist") && <label style={{ color: 'red', position: 'absolute', marginTop: "15px"}}>
              { message }
            </label> }
          </div>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            value={ username }
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div id="password-wrapper">
            <label htmlFor="password">Password</label>
            { isSignIn && <a href="#" id="forgot-link">Forgot password?</a> }
            { (message === "Password should be 6 character long" || message === "Incorrect password") && <label style={{ color: 'red', position: 'absolute', marginTop: "30px"}}>
              { message }
            </label> }
          </div>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={ password }
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{ isSignIn ? 'Sign In' : 'Sign Up' }</button>

          <p id="switch-auth">
            { isSignIn ? 'New to Sticker Kadai?' : 'Already have an account?' }
            <button type="button" id="switch-to-signup" onClick={ handleToggle }>
              { isSignIn ? 'Sign Up' : 'Sign In' }
            </button>
          </p>
        </form>
      </div>
    );
  }
  
  if(signedIn) {
    return(
      <div>
        <p>Logged in as</p>
        <h1>{ username }</h1>
      </div>
    );
  }
}

export default Loginsignup;