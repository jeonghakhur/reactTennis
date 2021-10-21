import React, { useEffect, useState } from 'react'
import AppRouter from './AppRouter'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function App() {
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj(user)
      } else {
        setUserObj(false)
      }
      setInit(true)
    })
    console.log('mm')
  }, [auth])


  return (
    <>
      {init ? (
        <AppRouter userObj={userObj} isLoggedIn={Boolean(userObj)} />
      ) : (
        'Initialize..'
      )}
    </>
  )
}

export default App
