import React, { useState, useEffect } from 'react'
import _ from 'lodash'

const GameResult = (props) => {
  const { data } = props
  const [gameResult, setGameResult] = useState([])
  const [type, setType] = useState(false)
  const [pairType, setPairType] = useState(1)
  const [resultType, setResultType] = useState(1)
  const [pairName, setPairName] = useState('')
  const [count, setCount] = useState({
    win: 0,
    lose: 0,
    tie: 0,
  })
  // const [t]

  const init = (data) => {
    const newArray = _.map(data, (val) => ({
      ...val,
      games: _.filter(val.games, (game) => game.player[0] !== ''),
    }))

    setGameResult(newArray)
  }

  const handleClickPlayer = (name, typePair = 1, typeResult = 1) => {
    setCount({win: 0, lose: 0, tie: 0})
    setPairName(name)
    setPairType(typePair)
    setResultType(typeResult)
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
        const pairGames = []
        for (let i = 0; i < games.length; i += 1) {
          const indexA = games[i].player.indexOf(name[0])
          const indexB = games[i].player.indexOf(name[1])
          let result = ''
          const {score} = games[i]
          
          if (indexA < 2) {
            if (score[0] > score[1]) {
              result = 'win'
            } else if (score[0] === score[1]) {
              result = 'tie'
            } else {
              result = 'lose'
            }
          } else {
            if (score[0] < score[1]) {
              result = 'win'
            } else if (score[0] === score[1]) {
              result = 'tie'
            } else {
              result = 'lose'
            }
          }

          games[i].result = result

          if (
            (indexA === 0 && indexB === 1) ||
            (indexA === 1 && indexB === 0) ||
            (indexA === 2 && indexB === 3) ||
            (indexA === 3 && indexB === 2)
          ) {
            if (typePair === 1 || typePair === 2) pairGames.push(games[i])
            // return
          } else {
            if (typePair === 1 || typePair === 3) pairGames.push(games[i])
          }

        }

        if (pairGames.length > 0) {
          setCount(pre => ({
            ...pre,
            win: pre.win + _.size(_.filter(pairGames, {'result': 'win'})),
            lose: pre.lose + _.size(_.filter(pairGames, {'result': 'lose'})),
            tie: pre.tie + _.size(_.filter(pairGames, {'result': 'tie'})),
          }))

          const resultGames = _.filter(pairGames, game => {
            if (typeResult === 1) {
              return game
            } else if (typeResult === 2) {
              return game.result === 'win'
            } else if (typeResult === 3) {
              return game.result === 'lose'
            } else if (typeResult === 4) {
              return game.result === 'tie'
            }
          })

          if (resultGames.length > 0) {
            newArray.push({
              ...val,
              games: resultGames,
            })
          }
        }
      }
    })

    setType(true)
    setGameResult(newArray)
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
                    className="pair"
                    onClick={() => {
                      handleClickPlayer([player[0], player[1]], 1)
                    }}
                  >
                    {player[0]},{player[1]}
                    <span>({score[0]})</span>
                  </td>
                  <td
                    className="pair"
                    onClick={() => {
                      handleClickPlayer([player[2], player[3]], 1)
                    }}
                  >
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

  const handleChangePairType = (e) => {
    const value = Number(e.target.value)
    handleClickPlayer(pairName, value, resultType)
  }

  const handleChangeResultType = (e) => {
    const value = Number(e.target.value)
    handleClickPlayer(pairName, pairType, value)
  }

  const handleClickPairChagne = () => {
    handleClickPlayer(pairName.reverse(), 1)
  }

  useEffect(() => {
    init(data)
  }, [data])

  return (
    <div className="game-result">
      {type && (
        <div className="header">
          <h3>
            <b onClick={handleClickPairChagne}>{pairName[0]}님이 {pairName[1]}님</b>과 함께한 게임 결과 {count.win} 승 {count.tie} 무 {count.lose} 패
          </h3>
          <select onChange={handleChangePairType} value={pairType}>
            <option value="1">전체 보기</option>
            <option value="2">같은 페어</option>
            <option value="3">다른 페어</option>
          </select>
          <select onChange={handleChangeResultType}>
            <option value="1">전체</option>
            <option value="2">승</option>
            <option value="3">패</option>
            <option value="4">무</option>
          </select>
        </div>
      )}
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClickBack}
          >
            돌아가기
          </button>
        </div>
      )}
    </div>
  )
}

export default GameResult
