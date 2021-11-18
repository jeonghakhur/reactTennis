import React, { useState, useEffect } from 'react'
import _ from 'lodash'

const LastGame = ({ data }) => {
  const [games, setGames] = useState([])
  const [court, setCourt] = useState(false)
  const [ranking, setRanking] = useState()

  const init = (data) => {
    const newArray = _.map(data, (val) => ({
      ...val,
      games: _.filter(val.games, (game) => game.player[0] !== ''),
    }))

    setCourt({
      date: data.date,
      name: data.name,
    })
    getGames(data.games)
    // console.log(data)
  }

  const getGames = (data) => {
    const newArray = _.map(
      _.filter(data, (o) => o.player[0] !== ''),
      (o) => {
        const date = new Date(o.startTime)
        const hour = date.getHours()
        const minute = date.getMinutes()
        o.startTime = `${hour < 10 ? '0' + hour : hour}:${
          minute < 10 ? '0' + minute : minute
        }`

        return o
      }
    )

    setGames(newArray)
    getUserGames(newArray)
  }

  const getUserGames = (data) => {
    const gameMembers = []
    data.forEach((game) => {
      game.player.forEach((member) => {
        if (gameMembers.indexOf(member) === -1) {
          gameMembers.push(member)
        }
      })
    })

    const tempUserGame = gameMembers.map((member) => {
      const obj = {}
      obj.name = member
      obj.game = data.filter((game) => game.player.indexOf(member) !== -1)
      return obj
    })

    const userGame = []
    tempUserGame.forEach((user) => {
      let pointTotal = 0
      let pointWin = 0
      let pointLose = 0
      let countWin = 0
      let countLose = 0
      let countTie = 0

      user.game.forEach((game) => {
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
        countTotal: user.game.length,
        pointTotal,
        pointPercent: Number(countWin / (countWin + countLose)).toFixed(3),
        pointWin,
        pointLose,
        pointDiff: pointWin - pointLose,
      })
    })

    const rankingUser = _.orderBy(
      userGame,
      ['pointTotal', 'name'],
      ['desc', 'asc']
    )

    const len = rankingUser.length
    const point = rankingUser.map((user) => user.pointTotal)
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < len; j += 1) {
        if (point[j] > point[i]) rankingUser[i].ranking += 1
      }
    }

    setRanking(rankingUser)
  }

  useEffect(() => {
    init(data)

    // console.log(totalGames)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section>
      <h3>
        {court.date} {court.name} 게임 순위
      </h3>
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
          <tbody>
            {ranking &&
              ranking.map((game, idx) => {
                const {
                  ranking,
                  name,
                  countWin,
                  countTie,
                  countLose,
                  countTotal,
                  pointTotal,
                  pointPercent,
                  pointWin,
                  pointLose,
                  pointDiff,
                } = game
                return (
                  <tr key={idx}>
                    <td>{ranking}</td>
                    <td>{name}</td>
                    <td>{countWin}</td>
                    <td>{countTie}</td>
                    <td>{countLose}</td>
                    <td>{countTotal}</td>
                    <td>{pointTotal}</td>
                    <td>{pointPercent}</td>
                    <td>{pointWin}</td>
                    <td>{pointLose}</td>
                    <td>{pointDiff}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default LastGame
