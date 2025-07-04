import { useState } from 'react'
import './App.css'
import Loginsignup  from './Loginsignup/Loginsignup';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Loginsignup/>
    </div>
  );
}

export default App
