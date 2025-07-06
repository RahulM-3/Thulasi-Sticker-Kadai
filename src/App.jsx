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
    <div style={{position: "absolute", top: "0", left: "0"}}>
      <p>Logged in as: { signedInUser }</p>
      <button onClick={ logout }>Logout</button>
    </div>
  );
}

export default App;
