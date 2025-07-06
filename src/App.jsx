import { useEffect, useState } from 'react';
import './App.css';
import Loginsignup from './Loginsignup/Loginsignup';

function App() {
  const [signedInUser, setSignedInUser] = useState(null);

  if (!signedInUser) {
    return <Loginsignup setSignedInUser={ setSignedInUser } />;
  }

  return (
    <div>
      <p>Logged in as:</p>
      <h1>{signedInUser}</h1>
    </div>
  );
}

export default App;
