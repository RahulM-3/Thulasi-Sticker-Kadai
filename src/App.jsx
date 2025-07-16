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
  const [chatInfoList, setChatInfoList] = useState([]);

  // update last online
  useEffect(() => {
    const updateLastOnline = async () => {
      await window.firebaseAPI.lastOnline(signedInUser);
    }
    if (!signedInUser) return;

    let intervalId = setInterval(() => {
      updateLastOnline();
    }, 1000);

    const handleUnload = () => {
      clearInterval(intervalId);
      updateLastOnline();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [signedInUser]);

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

  // open chat
  function openChat(chatusername) {

  }

  // get recent chats info
  useEffect(() => {
    if (!recentChats || !signedInUser) return;

    const intervalId = setInterval(async () => {
      const infoList = [];

      for (const username of recentChats) {
        const info = await window.firebaseAPI.getRecentChatUserInfo(signedInUser, username);

        infoList.push({
          username: username,
          userlastOnline: info.userlastOnline,
          lastMessage: info.lastMessage || '',
          unread: info.unread || false
        });
      }

      setChatInfoList(infoList);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [recentChats, signedInUser]);

  // last online in readable time
  const timeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return 'Online';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  // render recent chats in list
  function renderRecentChats() {
    const unread = false;
    return (
      <ul className="chat-list">
        {chatInfoList.map(({ username, userlastOnline, lastMessage, unread }) => (
          <li key={username} className="chat-item" onClick={() => openChat(username)}>
            <div className="chat-left">
              <div className="chat-username-wrapper">
                <span className="chat-username">{username}</span>
                <span
                  className={`chat-status-circle ${timeAgo(userlastOnline) === 'Online' ? 'online' : 'offline'}`}
                  title={
                    timeAgo(userlastOnline) === 'Online'
                      ? 'Online'
                      : `Last seen ${timeAgo(userlastOnline)}`
                  }
                >
                  {timeAgo(userlastOnline) !== 'Online' && timeAgo(userlastOnline)}
                </span>
              </div>
                
              <span className="chat-last-message">{lastMessage || 'No messages yet'}</span>
            </div>
            <div className="chat-right">
              {unread ? (
                <span className="chat-status unread" title="Unread"></span>
              ) : (<span></span>)}
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
