import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const GameResult = (props) => {
  const { data } = props
  const { name } = useParams()
  const [gameUser, setGameUser] = useState(false)
  const [gameResult, setGameResult] = useState([])
  const [totalCount, setTotalCount] = useState({
    win: 0,
    lose: 0,
    tie: 0,
  })

  const init = (data) => {
    setTotalCount({ win: 0, lose: 0, tie: 0 })
    const user = name ? (name.indexOf('-') ? name.split('-') : [name]) : []
    const newArray = []
    data.forEach((val) => {
      let games = false
      if (user.length) {
        // 유저 게임
        games = val.games.filter((game) => {
          let flag = false
          for (let i = 0; i < user.length; i += 1) {
            const playerIndex = game.player.indexOf(user[i])
            if (playerIndex === -1) {
              return false
            } else {
              setMatch(game, user[i])
              flag = true
            }
          }

          // 같은 페어인지 확인
          if (user.length > 1) {
            flag = getPair(game.player, user)
          }

          if (flag) {
            return game
          } else {
            return false
          }
        })
      } else {
        // 전체 게임
        games = val.games.filter((game) => game.player[0] !== '')
      }

      if (games.length) {
        newArray.push({
          ...val,
          count: getCount(games),
          games,
        })
      }
    })

    if (user.length === 2) {
      setGameUser(user.join(','))
    } else if (user.length === 1) {
      setGameUser(user[0])
    }
    // setTotalCount(tempCount)
    setGameResult(newArray)
  }

  const getCount = (games) => {
    const obj = {
      win: 0,
      lose: 0,
      tie: 0,
    }

    games.forEach((game) => {
      const { result } = game
      if (result === 'win') obj.win += 1
      if (result === 'lose') obj.lose += 1
      if (result === 'tie') obj.tie += 1
    })

    setTotalCount((pre) => ({
      win: pre.win + obj.win,
      lose: pre.lose + obj.lose,
      tie: pre.tie + obj.tie,
    }))

    return obj
  }

  const setMatch = (game, user) => {
    const userIndex = game.player.indexOf(user)

    const { score } = game
    if (userIndex < 2) {
      game.result = setScoreResult(score[0], score[1])
    } else {
      game.result = setScoreResult(score[1], score[0])
    }
  }

  const getPair = (player, user) => {
    const indexA = player.indexOf(user[0])
    const indexB = player.indexOf(user[1])
    return (indexA === 0 && indexB === 1) ||
      (indexA === 1 && indexB === 0) ||
      (indexA === 2 && indexB === 3) ||
      (indexA === 3 && indexB === 2)
      ? true
      : false
  }

  const setScoreResult = (score1, score2) => {
    if (score1 > score2) {
      return 'win'
    } else if (score1 === score2) {
      return 'tie'
    } else {
      return 'lose'
    }
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
              const { number, startTime, player, score, result } = game
              const date = new Date(startTime)
              const hour = date.getHours()
              const minute = date.getMinutes()
              const hourMinute = `${hour < 10 ? '0' + hour : hour}:${
                minute < 10 ? '0' + minute : minute
              }`

              return (
                <tr key={idx} className={result}>
                  <td>{idx + 1}</td>
                  <td>{number}</td>
                  <td>{hourMinute}</td>
                  <td className="pair">
                    <Link
                      to={{
                        pathname: `/totalGame/${player[0]}-${player[1]}`,
                        state: {
                          totalGame: data,
                        },
                      }}
                    >
                      {player[0]},{player[1]}
                      <span>({score[0]})</span>
                    </Link>
                  </td>
                  <td className="pair">
                    <Link
                      to={{
                        pathname: `/totalGame/${player[2]}-${player[3]}`,
                        state: {
                          totalGame: data,
                        },
                      }}
                    >
                      {player[2]},{player[3]}
                      <span>({score[1]})</span>
                    </Link>
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
    if (data) {
      init(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, name])

  return (
    <div className="game-result">
      {data.length > 1 && (
        <div className="header">
          <h2>{gameUser && <span>{gameUser}님</span>} 전체게임결과보기 </h2>
          <p>
            총 {totalCount.win}승, {totalCount.tie}무, {totalCount.lose}패
          </p>
        </div>
      )}
      {gameResult.map((data) => {
        const { key, date, name, games, count } = data
        return (
          <div key={key} className="game-result-item">
            <div className="header">
              <p className="date-name">
                {date} {name}
              </p>
              {gameUser && (
                <p className="count">
                  {count.win}승 {count.tie}무 {count.lose}패
                </p>
              )}
            </div>
            <Games games={games} />
          </div>
        )
      })}
    </div>
  )
}

export default GameResult
