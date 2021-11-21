import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { ref, onValue, off } from 'firebase/database'
import GameRanking from '../components/GameRanking'
import GameResult from '../components/GameResult'
import _ from 'lodash'
// import LastGame from '../components/LastGame'

const DOC_GAME = 'reactTennis/games'

const Home = ({ userObj }) => {
  const [lastGame, setLastGame] = useState(false)
  const [totalGame, setTotalGame] = useState(false)

  const setData = (data) => {
    const finalGame = _.orderBy(
      _.filter(data, (val) => val.final === true),
      'date',
      'desc'
    )
    setTotalGame(finalGame)
    setLastGame([_.maxBy(finalGame, 'date')])
  }

  useEffect(() => {
    onValue(ref(db, DOC_GAME), (snapshot) => {
      const data = []
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          data.push({
            key: child.key,
            ...child.val(),
          })
        })
        setData(data)
      } else {
        console.log('not games')
      }
    })
    return () => {
      off(ref(db, DOC_GAME))
    }
  }, [])

  // console.clear()
  return (
    <div>
      <h2>최근게임순위</h2>
      <GameRanking data={lastGame} type="lastGame" />
      <div className="header-wrap">
        <h2>최근게임결과</h2>
        <Link
          to={{
            pathname: '/totalGame',
            state: {
              totalGame,
            },
          }}
        >
          전체게임결과보기
        </Link>
      </div>
      <GameResult data={lastGame} />
      <h3>전체게임순위</h3>
      <GameRanking data={totalGame} type="totalGame" />
    </div>
  )
}

export default Home
