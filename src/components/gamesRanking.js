import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { ref, onValue } from 'firebase/database'
import _ from 'lodash'
import LastGame from '../components/LastGame'

const DOC_GAME = 'reactTennis/games'

const GamesRanking = ({ members }) => {
  // const [games, setGames] = useState([])
  const [totalGames, setTotalGames] = useState([])
  const [userGames, setUserGames] = useState(false)

  const getGames = (data) => {
    const newArray = []
    data.forEach((data) => {
      if (!data.games) return
      data.games.forEach((games) => {
        if (games.player[0] !== '') {
          newArray.push(games)
        }
      })
    })
    setTotalGames(newArray)
  }

  const getUserGames = () => {
    const gameMemberArray = []
    totalGames.forEach((game) => {
      game.player.forEach((member) => {
        if (gameMemberArray.indexOf(member) === -1) {
          gameMemberArray.push(member)
        }
      })
    })

    const tempUserGame = gameMemberArray.map((gameMember) => {
      const obj = {}
      obj.name = gameMember
      obj.game = totalGames.filter(
        (game) => game.player.indexOf(gameMember) !== -1
      )
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

    const rankingUser = _.reverse(
      _.sortBy(
        _.filter(userGame, (game) => {
          return _.find(members, (member) => member.name === game.name)
        }),
        'pointTotal'
      )
    )

    const len = rankingUser.length
    const point = rankingUser.map((user) => user.pointTotal)
    for (let i = 0; i < len; i += 1) {
      for (let j = 0; j < len; j += 1) {
        if (point[j] > point[i]) rankingUser[i].ranking += 1
      }
    }

    const container = document.querySelector('#rankingContainer')

    rankingUser.forEach((user) => {
      const row = document.createElement('tr')
      for (const p in user) {
        const cell = document.createElement('td')
        cell.classList.add(p)
        cell.textContent = user[p]
        row.appendChild(cell)
      }
      container.appendChild(row)
    })

    setUserGames(rankingUser)
  }

  useEffect(() => {
    onValue(ref(db, DOC_GAME), (snapshot) => {
      const newArray = []
      snapshot.forEach((child) => {
        newArray.push({
          id: child.key,
          ...child.val(),
        })
      })

      getGames(newArray)

      if (members.length > 0) {
        getUserGames()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members])

  return (
    <section>
      <LastGame totalGames={totalGames} />
      <h2>Total Games Ranking</h2>
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

          <tbody id="rankingContainer">
            {/* {userGames && userGames.map(game => (<tr><td>1</td></tr>))} */}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default GamesRanking
