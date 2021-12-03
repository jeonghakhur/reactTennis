import React, {useState, useEffect} from 'react'
import GameResult from '../components/GameResult'

const TotalGame = (props) => {
  const { totalGames } = props
  const [finalGmaes, setFinalGames] = useState(false)

  useEffect(() => {
    if (!totalGames) return
    setFinalGames(totalGames.filter(val => val.final === true))
  }, [totalGames])

  return (
    <div>
      <GameResult data={finalGmaes} />
    </div>
  )
}

export default TotalGame
