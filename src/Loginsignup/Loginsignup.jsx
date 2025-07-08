import React, { useState, useEffect } from 'react';
import './Loginsignup.css';

function Loginsignup({ setSignedInUser, setLoadingScreen }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (isSignIn) {
      try {
        const result = await window.firebaseAPI.signinUser(username, password);
        if(result.data.success) {
          await window.electronAPI.saveUserCreds(username, password);
          setSignedInUser(username);
        }
        setMessage(result.data.message);
      } 
      catch (err) {
        setMessage('Signin failed: ' + err.message);
      }
      finally {
        setIsSubmitting(false);
      }
    } 
    else {
      try {
        const result = await window.firebaseAPI.signupUser(username, password);
        if(result.data.success) {
          await window.electronAPI.saveUserCreds(username, password);
          setSignedInUser(username);
        }
        setMessage(result.data.message);
      }
      catch (err) {
        setMessage('Signup failed: ' + err.message);
      }
      finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const usercreds = await window.electronAPI.getUserCreds();
      if (usercreds) {
        const result = await window.firebaseAPI.signinUser(usercreds.username, usercreds.password);
        if (result.data.success) {
          setSignedInUser(usercreds.username);
        }
      }
      setLoadingScreen(false);
    })();
  }, []);

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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <img src="./button_loading_screen.gif" alt="loading" style={{ position: "relative", width: "80px", 
                                                                          height: "80px", bottom: "31px" }} />) : 
            (isSignIn ? 'Sign In' : 'Sign Up')
          }
        </button>
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

export default Loginsignup;