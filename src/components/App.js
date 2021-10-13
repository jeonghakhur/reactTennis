import React, { useState } from 'react';
import AppRouter from './AppRouter';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  // console.clear()
  const [ isLoggedIn, setLoggedIn ] = useState(false)
  const auth = getAuth()

  onAuthStateChanged(auth, user => {
    if (user) {
      setLoggedIn(true)
    }
  })
  
  return (
    <AppRouter isLoggedIn={isLoggedIn} />
  );
}

export default App;
