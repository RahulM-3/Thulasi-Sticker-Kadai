import './Loginsignup.css'

function Loginsignup() {
  return (
    <div id="auth-container">
      <form id="signin-form">
        <h2>Sign In</h2>

        <label for="username">Username</label>
        <input type="text" id="username" placeholder="Enter username" required />

        <div id="password-wrapper">
          <label for="password">Password</label>
          <a href="#" id="forgot-link">Forgot password?</a>
        </div>
        <input type="password" id="password" placeholder="Enter password" required />

        <button type="submit">Sign In</button>

        <p id="switch-auth">
          New to Sticker Kadai?
        <button type="button" id="switch-to-signin">Sign Up</button>
        </p>
      </form>
    </div>
  );
}

export default Loginsignup