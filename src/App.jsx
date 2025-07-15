import { useEffect, useState } from 'react';
import './App.css';
import Loginsignup from './Loginsignup/Loginsignup';

function App() {
  // consts
  const [signedInUser, setSignedInUser] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState("");
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await window.firebaseAPI.getRecentChat(signedInUser);
      setRecentChats(chats);
    };
    fetchChats();
  }, [signedInUser]);

  // logout function
  const logout = async () => {
    await window.electronAPI.saveUserCreds("", "");
    setSignedInUser(null);
  }

  function onChatClick(chatusername) {

  }

  // render recent chats in list
  function renderRecentChats() {
    const unread = true;
    return (
      <ul className="chat-list">
        {recentChats.map(username => (
          <li key={username} className="chat-item" onClick={() => onChatClick(username)}>
            <div className="chat-left">
              <span className="chat-username">{username}</span>
              <span className="chat-last-message">{}</span>
            </div>
            <div className="chat-right">
              {unread ? (
                <span className="chat-status unread" title="Unread"></span>
              ) : (
                <span className="chat-status read" title="Read"></span>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  // start new chat
  const newChatSubmit = async (e) => {
    e.preventDefault();
    setShowAddPopup(false);
    const result = await window.firebaseAPI.startNewChat(newChatUsername, signedInUser);
    setNewChatUsername("");
    const chats = await window.firebaseAPI.getRecentChat(signedInUser);
    setRecentChats(chats);
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
          <button id='addbutton' onClick={() => setShowAddPopup(true)}>
            <img src='./add_button.png' alt='add' />
          </button>
        </div>

        <div id="recentChats">
          <h4>Recent Chats</h4>
          {
            recentChats.length > 0
              ? renderRecentChats(recentChats, (username) => {
                  console.log("Clicked:", username);
                })
              : <p>No recent chats</p>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
