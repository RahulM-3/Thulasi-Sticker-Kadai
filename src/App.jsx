import { useEffect, useState } from 'react';
import './App.css';
import Loginsignup from './Loginsignup/Loginsignup';

function App() {
  const [signedInUser, setSignedInUser] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(true);

  const logout = async () => {
    await window.electronAPI.saveUserCreds("", "");
    setSignedInUser(null);
  }
  if (!signedInUser) {
    return (
      <div>
        {loadingScreen && (
          <div className="loading-overlay">
            <img src="./loading-darkmode.gif" alt="loading" />
          </div>
          )
        }

      <Loginsignup
        setSignedInUser={setSignedInUser}
        setLoadingScreen={setLoadingScreen}
      />
      </div>
    );
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
