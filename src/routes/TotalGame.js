import React from 'react'
import GameResult from '../components/GameResult'

const TotalGame = (props) => {
  const {history} = props
  const {totalGame} = history.location.state
  
  return (
    <div>
      <h2>전체게임결과</h2>
      <GameResult data={totalGame} />
    </div>
  )
}

export default TotalGame