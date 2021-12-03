import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GameRanking from '../components/GameRanking'
import GameResult from '../components/GameResult'
import _ from 'lodash'

const Home = ({ userObj, totalGames }) => {
  const [lastGame, setLastGame] = useState(false)
  const [finalGames, setFinalGames] = useState(false)



  useEffect(() => {
    if (totalGames) {
      const final = _.filter(totalGames, val => val.final === true)
      setLastGame([_.maxBy(final, 'date')])
      setFinalGames(final)
    }
  }, [totalGames])

  if (lastGame) {
    return (
      <div>
        <h2>최근게임순위</h2>
        <GameRanking data={lastGame} type="lastGame" />
        <div className="header">
          <h2>최근게임결과</h2>
          <Link
            to="/totalGame">
            전체게임결과보기
          </Link>
        </div>
        <GameResult data={lastGame} />
        <h3>전체게임순위</h3>
        <GameRanking data={finalGames} type="totalGame" />
      </div>
    ) 
  } else {
    return (
      <div>Loading...</div>
    )
  }
  // console.clear()

}

export default Home
