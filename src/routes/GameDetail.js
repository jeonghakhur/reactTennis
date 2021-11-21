import React, { useState, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { db } from '../firebase'
import { ref, update, onValue } from 'firebase/database'

const docs = 'reactTennis/games/'
const gameItemTemplate = `
  <td class="number">
  </td>
  <td class="court"></td>
  <td class="time"></td>
  <td class="pair">
    <input type="text" class="player" />
    <input type="text" class="player" />
  </td>
  <td class="pair">
    <input type="text" class="player" />
    <input type="text" class="player" />
  </td>
  <td class="score">
    <input type="number" class="score" min="0" max="6" />
    <input type="number" class="score" min="0" max="6" />
  </td>`

const GameDetail = ({ userObj }) => {
  const user = userObj.email ? userObj.email : false
  const admin = user === 'jeonghak.hur@gmail.com' ? true : false
  const match = useRouteMatch()
  const gameId = match.params.name
  // const [loadData, setLoadData] = useState()
  let lastFocus = false
  const [saveGames, setSaveGames] = useState()
  // const [isInit, setIsInit] = useState(false)

  const init = (data) => {
    console.log('init', data)
    const { date, court, moveTime, games } = data
    const dateArr = date.split('-')

    let newArray = []

    if (games) {
      newArray = games.map((game) => {
        if (!game.player) {
          game.player = ['', '', '', '']
        }
        if (!game.score) {
          game.score = ['', '']
        }
        return game
      })
      // console.log('newArray', newArray)
    } else {
      court.forEach((obj, idx) => {
        const moveTimestamp = moveTime * 60 * 1000
        const { number, startHour, startMinute, endHour, endMinute } = obj
        const startTime = new Date(
          dateArr[0],
          dateArr[1] - 1,
          dateArr[2],
          startHour,
          startMinute
        ).getTime()
        const endTime = new Date(
          dateArr[0],
          dateArr[1] - 1,
          dateArr[2],
          endHour,
          endMinute
        ).getTime()
        const gameCount = (endTime - startTime) / moveTimestamp
        for (let i = 0; i < gameCount; i += 1) {
          const id = `${number}-${i}`
          newArray.push({
            id,
            number,
            startTime: startTime + moveTimestamp * i,
            endTime: startTime + moveTimestamp * i + moveTimestamp,
            player: ['', '', '', ''],
            score: ['', ''],
          })
        }
      })
      newArray.sort((a, b) => a.startTime - b.startTime)
    }

    setSaveGames(newArray)
  }

  const setElement = (dataArray) => {
    if (!dataArray) return
    const container = document.querySelector('#gameContainer')
    container.innerHTML = ''
    dataArray.forEach((data, dataIndex) => {
      const { id, number, startTime, endTime, player, score } = data
      const startDate = new Date(startTime)
      let startHour = startDate.getHours()
      startHour = startHour < 10 ? '0' + startHour : startHour
      let startMinute = startDate.getMinutes()
      startMinute = startMinute < 10 ? '0' + startMinute : startMinute
      const endDate = new Date(endTime)
      let endHour = endDate.getHours()
      endHour = endHour < 10 ? '0' + endHour : endHour
      let endMinute = endDate.getMinutes()
      endMinute = endMinute < 10 ? '0' + endMinute : endMinute
      const item = document.createElement('tr')
      item.key = id
      item.classList.add('game-item')
      item.innerHTML = gameItemTemplate
      item.querySelector('.number').textContent = dataIndex + 1
      item.querySelector('.court').textContent = number
      item.querySelector(
        '.time'
      ).innerHTML = `${startHour}:${startMinute} <br /> ${endHour}:${endMinute}`
      // head.textContent = `${number}번 코트
      const inputName = item.querySelectorAll('input[type="text"]')
      const inputScore = item.querySelectorAll('input[type="number"]')

      inputName.forEach((el, idx) => {
        el.name = 'name'
        el.id = `name-${id}-${idx}`
        el.dataset.id = 'name-' + id
        el.dataset.index = idx
        el.value = player[idx] ? player[idx] : ''
      })

      inputScore.forEach((el, idx) => {
        el.name = 'score'
        el.id = `score-${id}-${idx}`
        el.dataset.id = 'score-' + id
        el.dataset.index = idx
        el.value = score[idx] ? score[idx] : ''
      })

      container.append(item)
    })

    document.querySelector('#gameContainer').addEventListener(
      'focus',
      (e) => {
        if (e.target.tagName === 'INPUT') {
          lastFocus = e.target.id
        }
      },
      { capture: true }
    )
  }

  const handleSubmitGame = (e, final) => {
    e.preventDefault()

    const newArray = saveGames.map((game) => {
      const newPlayer = game.player.map((name, idx) => {
        const el = document.querySelector(
          `[data-id="name-${game.id}"][data-index="${idx}"]`
        )
        return name === el.value ? name : el.value
      })
      const newScore = game.score.map((score, idx) => {
        const el = document.querySelector(
          `[data-id="score-${game.id}"][data-index="${idx}"]`
        )
        return score === el.value ? score : el.value
      })
      return {
        ...game,
        player: [...newPlayer],
        score: [...newScore],
      }
    })

    update(ref(db, `${docs}${gameId}`), {
      games: newArray,
      final: final ? true : false,
      write: user,
      saveTime: new Date().getTime(),
    }).then(() => {
      if (lastFocus) {
        document.querySelector(`#${lastFocus}`).focus()
      }
    })
    //
  }

  useEffect(() => {
    console.log('effect')
    onValue(ref(db, `${docs}${gameId}`), (snapshot) => {
      init(snapshot.val())
    })

    // readData()
    // setElement()
    // readData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="game-detail">
      <form onSubmit={handleSubmitGame}>
        <div className="scroll-wrap">
          <table className="table">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col width="20%" />
            </colgroup>
            <thead>
              <tr>
                <th>번호</th>
                <th>코트</th>
                <th>사간</th>
                <th>페어 A</th>
                <th>페어 B</th>
                <th>스코어</th>
              </tr>
            </thead>
            <tbody id="gameContainer">{setElement(saveGames)}</tbody>
          </table>
        </div>
        <div className="btn-wrap floating">
          {user && (
            <input
              type="submit"
              value="임시 저장"
              className="btn btn-secondary"
            />
          )}
          {admin && (
            <input
              button="butotn"
              value="최종 저장"
              className="btn btn-primary"
              onClick={(e) => {
                handleSubmitGame(e, 'final')
              }}
            />
          )}
        </div>
      </form>
    </div>
  )
}

export default GameDetail
