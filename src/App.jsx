import { useEffect, useState } from 'react';
import './App.css';
import Loginsignup from './Loginsignup/Loginsignup';

function App() {
  const [signedInUser, setSignedInUser] = useState(null);

  if (!signedInUser) {
    return <Loginsignup setSignedInUser={ setSignedInUser } />;
  }

  const logout = async () => {
    await window.electronAPI.saveUserCreds("", "");
    setSignedInUser(null);
  }

  return (
    <div id="main">
      <div id="sidebar">
        <div id="sidebarheader">
          <p>
            {signedInUser}
            <a onClick={logout}>Logout</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
