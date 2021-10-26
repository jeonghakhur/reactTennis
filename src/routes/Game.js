import React, {useState} from 'react'
import {Link} from 'react-router-dom'

const Game = () => {
  const now = new Date()
  const year = now.getFullYear()
  let month = now.getMonth() + 1
  const date = now.getDate()
  if (month < 10) {
    month = 0 + String(month)
  }

  console.log(year, month, date)
  const [gameDate, setGameDate] = useState(`${year}-${month}-${date}`)

  const handleChangeGameDate = e => {
    setGameDate(e.target.value)
  }

  return (
    <div>
      <div>
        <input name="gameDate" type="date" className="input date" value={gameDate} onChange={handleChangeGameDate} />
      </div>
      
      <p><Link to="/games/1">Link 1</Link></p>
    </div>
  )
}

export default Game