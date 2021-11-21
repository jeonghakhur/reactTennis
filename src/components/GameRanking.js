import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'

const GameRanking = ({ data }) => {
  const [userRanking, setUserRanking] = useState(false)
  // console.clear()
  let gamsArray = []
  let members = []

  const Ranking = () => {
    // const container = document.querySelector('#')
    // container.innerHTML = ''
    // userRanking.forEach((user) => {
    //   const row = document.createElement('tr')
    //   for (const p in user) {
    //     if (p === 'games') continue
    //     const cell = document.createElement('td')
    //     cell.classList.add(p)
    //     cell.textContent = user[p]
    //     row.appendChild(cell)
    //   }
    //   container.appendChild(row)
    // })
    return (
      <tbody>
        {userRanking.map((val, idx) => {
          return (
            <tr key={idx}>
              <td>{val.ranking}</td>
              <td>
                <Link
                  to={{
                    pathname: '/totalGame/' + val.name,
                    state: {
                      totalGame: data,
                      name: val.name,
                    },
                  }}
                  className="under-line-offset"
                >
                  {val.name}
                </Link>
              </td>
              <td>{val.countWin}</td>
              <td>{val.countTie}</td>
              <td>{val.countLose}</td>
              <td>{val.countTotal}</td>
              <td>{val.pointTotal}</td>
              <td>{val.pointPercent}</td>
              <td>{val.pointWin}</td>
              <td>{val.pointLose}</td>
              <td>{val.pointDiff}</td>
            </tr>
          )
        })}
      </tbody>
    )
  }

  const setRanking = (data) => {
    setUserRanking(false)
    const rankingUser = _.orderBy(
      data,
      ['pointTotal', 'pointPercent'],
      ['desc', 'desc']
    )

    const len = rankingUser.length
    const point = rankingUser.map((user) => user.pointTotal)
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < len; j += 1) {
        if (point[j] > point[i]) rankingUser[i].ranking += 1
      }
    }

    setUserRanking(rankingUser)
  }

  const getUserGame = (data, user) => {
    const tmp = user.map((name) => {
      const obj = {}
      obj.name = name
      obj.games = data.filter((game) => game.player.indexOf(name) !== -1)
      return obj
    })

    const userGame = []
    tmp.forEach((user) => {
      let pointTotal = 0
      let pointWin = 0
      let pointLose = 0
      let countWin = 0
      let countLose = 0
      let countTie = 0

      user.games.forEach((game) => {
        const index = game.player.indexOf(user.name)
        let myScore = 0
        let yourScore = 0

        if (index < 2) {
          myScore = game.score[0]
          yourScore = game.score[1]
        } else {
          myScore = game.score[1]
          yourScore = game.score[0]
        }

        if (myScore > yourScore) {
          pointTotal += 3
          countWin += 1
        } else if (myScore === yourScore) {
          pointTotal += 1
          countTie += 1
        } else {
          pointTotal += 0
          countLose += 1
        }

        pointWin += Number(myScore)
        pointLose += Number(yourScore)
      })

      userGame.push({
        ranking: 1,
        name: user.name,
        countWin,
        countTie,
        countLose,
        countTotal: user.games.length,
        pointTotal,
        pointPercent: Number(countWin / (countWin + countLose)).toFixed(3),
        pointWin,
        pointLose,
        pointDiff: pointWin - pointLose,
        games: user.games,
      })
    })

    setRanking(userGame)
  }

  const getMember = (player) => {
    player.forEach((name) => {
      if (members.indexOf(name) === -1) {
        members.push(name)
      }
    })
  }

  const init = (data) => {
    if (!data) return

    data.forEach((val) => {
      val.games.forEach((game) => {
        if (game.player[0] !== '') {
          getMember(game.player)
          gamsArray.push(game)
        }
      })
    })

    getUserGame(gamsArray, members)
  }

  useEffect(() => {
    // console.log('data', data)
    init(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div>
      {userRanking && (
        <div className="scroll-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>순위</th>
                <th>이름</th>
                <th>승</th>
                <th>무</th>
                <th>패</th>
                <th>게임</th>
                <th>승점</th>
                <th>승률</th>
                <th>득점</th>
                <th>실점</th>
                <th>마진</th>
              </tr>
            </thead>
            <Ranking />
          </table>
        </div>
      )}
    </div>
  )
}

export default GameRanking
