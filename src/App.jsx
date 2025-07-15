import { useEffect, useState } from 'react';
import './App.css';
import Loginsignup from './Loginsignup/Loginsignup';

function App() {
  // consts
  const [signedInUser, setSignedInUser] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState("");

  // logout function
  const logout = async () => {
    await window.electronAPI.saveUserCreds("", "");
    setSignedInUser(null);
  }

  // start new chat
  const newChatSubmit = async (e) => {
    e.preventDefault();
    setShowAddPopup(false);
    const result = await window.firebaseAPI.startNewChat(newChatUsername, signedInUser);
    setNewChatUsername("");
    console.log(result);
  }

  // login if user is not signedin
  if (!signedInUser) {
    return (
      // loading screen && signin/signup page
      <div>
        {loadingScreen && (
          <div className="loading-overlay">
            <img src="./loading_darkmode.gif" alt="loading" />
          </div>
          )
        }
      <Loginsignup
        setSignedInUser={ setSignedInUser }
        setLoadingScreen={ setLoadingScreen }
      />
      </div>
    );
  }
  
  // main page
  return (
    <div id="main">
      {showAddPopup && (
        <div className="popup-overlay">
          <div className="popup-box minimal">
            <button className="close-button" onClick={ () => setShowAddPopup(false) }>✕</button>
            <input
              type="text"
              placeholder="Enter username to chat"
              value={ newChatUsername }
              onChange={(e) => setNewChatUsername(e.target.value)}
            />
            <button
              className="chat-button"
              onClick={ newChatSubmit }
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
          <button id='addbutton' onClick={ () => setShowAddPopup(true) }>
            <img src='./add_button.png' alt='add'></img>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
