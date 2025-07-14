import { useEffect, useState } from 'react';
import './App.css';
import Loginsignup from './Loginsignup/Loginsignup';

function App() {
  const [signedInUser, setSignedInUser] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState("");

  const logout = async () => {
    await window.electronAPI.saveUserCreds("", "");
    setSignedInUser(null);
  }
  if (!signedInUser) {
    return (
      <div>
        {loadingScreen && (
          <div className="loading-overlay">
            <img src="./loading_darkmode.gif" alt="loading" />
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
      {showAddPopup && (
        <div className="popup-overlay">
          <div className="popup-box minimal">
            <button className="close-button" onClick={() => setShowAddPopup(false)}>✕</button>
            <input
              type="text"
              placeholder="Enter username to chat"
              value={newChatUsername}
              onChange={(e) => setNewChatUsername(e.target.value)}
            />
            <button
              className="chat-button"
              onClick={() => {
                setShowAddPopup(false);
                setNewChatUsername("");
              }}
            >
              Chat
            </button>
          </div>
        </div>
      )}

      <div id="sidebar">
        <div id="sidebarheader">
          <p>
            {signedInUser}
            <a onClick={logout}>Logout</a>
          </p>
          <button id='addbutton' onClick={() => setShowAddPopup(true)}>
            <img src='./add_button.png' alt='add'></img>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
