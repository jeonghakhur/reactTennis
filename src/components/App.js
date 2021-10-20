import React, { useEffect, useState } from 'react'
import AppRouter from './AppRouter'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function App() {
  console.clear()
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    console.clear()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj(user)
      } else {
        setUserObj(false)
      }
      setInit(true)
    })
  }, [auth])

  console.log('userObj', Boolean(userObj))

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
