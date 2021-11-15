import React, { useState, useEffect } from 'react'
import _ from 'lodash'

const GameResult = (props) => {
  const { data } = props
  const [gameResult, setGameResult] = useState([])

  const init = (data) => {
    const newArray = _.map(data, (val) => ({
      ...val,
      games: _.filter(val.games, (game) => game.player[0] !== ''),
    }))

    setGameResult(newArray)
  }

  const handleClickPlayer = (player) => {
    const newArray = []
    _.each(data, val => {
      const games = _.filter(val.games, game => game.player.indexOf('허정학') !== -1 && game.player.indexOf('장지훈') !== -1)
      if (games.length > 0) {
        _.each(games, game => {

          console.log('허정학', game.player.indexOf('허정학'))
          console.log('장지훈', game.player.indexOf('장지훈'))
        })
        newArray.push({
          ...val,
          games
        })
      }
    })

    console.log(newArray)
  }

  const Games = ({ games }) => {
    return (
      <div className="scroll-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>번호</th>
              <th>코트</th>
              <th>시간</th>
              <th>페어1</th>
              <th>페어2</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, idx) => {
              const { number, startTime, player, score } = game
              const date = new Date(startTime)
              const hour = date.getHours()
              const minute = date.getMinutes()
              const hourMinute = `${hour < 10 ? '0' + hour : hour}:${
                minute < 10 ? '0' + minute : minute
              }`
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{number}</td>
                  <td>{hourMinute}</td>
                  <td
                    onClick={() => {
                      handleClickPlayer([player[0], player[1]])
                    }}
                  >
                    {player[0]},{player[1]}
                    <span>({score[0]})</span>
                  </td>
                  <td>
                    {player[2]},{player[3]}
                    <span>({score[1]})</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  useEffect(() => {
    init(data)
  }, [data])

  return (
    <div>
      {gameResult.map((data) => {
        const { key, date, name, games } = data
        return (
          <div key={key}>
            <p>
              {date} {name}
            </p>
            <Games games={games} />
          </div>
        )
      })}
    </div>
  )
}

export default GameResult
