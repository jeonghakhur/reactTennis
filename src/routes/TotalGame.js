import React from 'react'
import GameResult from '../components/GameResult'

const TotalGame = (props) => {
  const { history } = props
  const { totalGame } = history.location.state

  return (
    <div>
      <GameResult data={totalGame} />
    </div>
  )
}

export default TotalGame
