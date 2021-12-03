import React, { useEffect, useState } from 'react'
import AppRouter from './AppRouter'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../firebase'
import { ref, onValue } from 'firebase/database'
import _ from 'lodash'
function App() {
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState(null)
  const auth = getAuth()
  const [totalGames, setTotalGames] = useState(false)

  const DOC_GAME = 'reactTennis/games'

  const setData = () => {
    onValue(ref(db, DOC_GAME), (snapshot) => {
      const data = []
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          data.push({
            id: child.key,
            ...child.val(),
          })
        })

        setTotalGames(_.orderBy(data, 'date','desc'))
      } else {
        console.log('not games')
      }
    })
  }

  useEffect(() => {
    console.clear()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj(user)
      } else {
        setUserObj(false)
      }
      setData()
      setInit(true)
    })
  }, [auth])

  return (
    <>
      {init ? (
        <AppRouter
          userObj={userObj}
          isLoggedIn={Boolean(userObj)}
          totalGames={totalGames}
        />
      ) : (
        'Initialize..'
      )}
    </>
  )
}

export default App
