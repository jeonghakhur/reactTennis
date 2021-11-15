import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { ref, push, set, onValue } from 'firebase/database'
import GameRanking from '../components/GameRanking'
import GameResult from '../components/GameResult'
import _ from 'lodash'

const DOC_GAME = 'reactTennis/games'

const Home = ({ userObj }) => {
  const [lastGame, setLastGame] = useState([])
  const [totalGame, setTotalGame] = useState(false)

  const setData = data => {
    const finalGame = _.orderBy(_.filter(data, val => val.final === true), 'date', 'desc')
    setTotalGame(finalGame)
    setLastGame([_.maxBy(finalGame, 'date')])
  }

  useEffect(() => {
    onValue(ref(db, DOC_GAME), snapshot => {
      const data = []
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          data.push({
            key: child.key,
            ...child.val()
          })
        })
        setData(data)
      } else {
        console.log('not games')
      }
    })
  }, [])

  // console.clear()
  return (
    <div>
      <GameRanking />
      <GameResult data={totalGame} type="lastGame" />
    </div>
  )
}

export default Home
