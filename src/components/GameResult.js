import React, { useState, useEffect } from 'react'
import _ from 'lodash'

const GameResult = (props) => {
  const { data } = props
  const [gameResult, setGameResult] = useState([])
  const [type, setType] = useState(false)
  // const [t]

  const init = (data) => {
    const newArray = _.map(data, (val) => ({
      ...val,
      games: _.filter(val.games, (game) => game.player[0] !== ''),
    }))

    setGameResult(newArray)
  }

  const handleClickPlayer = (name) => {
    const newArray = []
    _.each(data, (val) => {
      const games = _.filter(
        val.games,
        // (game) => game.player.indexOf(player[0]) !== -1 || game.player.indexOf(player[1]) !== -1
        (game) => {
          let flag = false
          for (let i = 0; i < name.length; i += 1) {
            if (game.player.indexOf(name[i]) === -1) {
              return
            } else {
              flag = true
            }
          }
          if (flag) {
            return game
          }
        }
      )

      if (games.length > 0) {
        let pair = false
        const obj = {}
        _.each(games, (game) => {
          
          const indexA = game.player.indexOf(name[0])
          const indexB = game.player.indexOf(name[1])

          if ((indexA === 0 && indexB === 1) || (indexA === 1 && indexB === 0) || (indexA === 2 && indexB === 3) || (indexA === 3 && indexB === 2)) {
            pair = true
          } else {
            pair = false
          }
          console.log(pair, indexA, indexB)
        })
        newArray.push({
          ...val,
          games,
        })
      }
    })
    console.log(newArray)
    setType(true)

    // document.querySelector('body').appendChild(<Modal />)

    setGameResult(newArray)

    // console.log(newArray)
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

  const handleClickBack = () => {
    init(data)
    setType(false)
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

      {type && (
        <div className="btn-wrap floating">
          <button type="button" className="btn btn-secondary" onClick={handleClickBack}>
            돌아가기
          </button>
        </div>
      )}
    </div>
  )
}

export default GameResult
