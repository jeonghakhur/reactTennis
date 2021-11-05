import React, { useState, useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { db } from '../firebase'
import { ref, update, onValue } from 'firebase/database'

const docs = 'reactTennis/games/'
const gameItemTemplate = `
  <td class="number"></td>
  <td class="corut"></td>
  <td class="time"></td>
  <td class="pair"></td>
  <td class="pair"></td>
  <td class="score"></td>
  <td class="delete"></td>
  <div class="game-head">게임 진행 시간: <span clsssName="game-time">12:00</span></div>
    <div class="d-flex">
      <div class="input-wrap">
        <div class="col">
          <span class="number">1</span>
          <input type="text" class="player" />
          <input type="text" class="player" />
          <input type="text" class="player" />
          <input type="text" class="player" />
          <input type="number" class="score" min="0" max="6" />
          <input type="number" class="score" min="0" max="6" />
        </div>
      </div>
    </div>
  </div>`

const GameDetail = () => {
  const match = useRouteMatch()
  const gameId = match.params.name
  // const [loadData, setLoadData] = useState()
  let lastFocus = false
  const [saveGames, setSaveGames] = useState()
  // const [isInit, setIsInit] = useState(false)

  const init = (data) => {
    console.log('init', data)
    const { date, name, court, moveTime, games } = data
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
            player: ['','','',''],
            score: ['', ''],
          })
        }
      })
      newArray.sort((a, b) => a.startTime - b.startTime)
    }

    setSaveGames(newArray)
  }

  const handleChangeName = (event, id, idx) => {
    const { value } = event.target
    // setNames([{id, idx, value}])

    // setSaveGames(
    //   saveGames.map((game, idx) => {
    //     if (idx === dataIndex) {
    //       game.player[inputIndex] = value
    //       return game
    //     } else {
    //       return game
    //     }
    //   })
    // )
  }

  const handleChangeScore = (event, dataIndex, inputIndex) => {
    const { value } = event.target
    if (value > 6) {
      alert('6 이상의 수를 입력할 수 없습니다.')
      event.target.value = ''
      event.target.focus()
      return
    }
    // setSaveGames(
    //   saveGames.map((game, idx) => {
    //     if (idx === dataIndex) {
    //       game.score[inputIndex] = value
    //       return game
    //     } else {
    //       return game
    //     }
    //   })
    // )
  }

  const setElement = (dataArray) => {
    if (!dataArray) return
    const container = document.querySelector('#gameContainer')
    container.innerHTML = ''
    dataArray.forEach((data, dataIndex) => {
      const { id, number, startTime, endTime, player, score } = data
      const startDate = new Date(startTime)
      let startHour = startDate.getHours()
      startHour = startHour < 10? '0' + startHour : startHour
      let startMinute = startDate.getMinutes()
      startMinute = startMinute < 10? '0' + startMinute : startMinute
      const endDate = new Date(endTime)
      let endHour = endDate.getHours()
      endHour = endHour < 10? '0' + endHour : endHour
      let endMinute = endDate.getMinutes()
      endMinute = endMinute < 10? '0' + endMinute : endMinute
      const item = document.createElement('div')
      item.classList.add('game-item')
      item.innerHTML = gameItemTemplate
      const head = item.querySelector('.game-head')
      head.textContent = `${number}번 코트 ${startHour}:${startMinute} ~ ${endHour}:${endMinute}`
      const inputName = item.querySelectorAll('input[type="text"]')
      const inputScore = item.querySelectorAll('input[type="number"]')

      inputName.forEach((el, idx) => {
        el.name = 'name'
        el.id = `name-${id}-${idx}`
        el.dataset.id = 'name-' + id
        el.dataset.index  = idx
        el.value = player[idx] ? player[idx] : ''
      })

      inputScore.forEach((el, idx) => {
        el.name = 'score'
        el.id = `score-${id}-${idx}`
        el.dataset.id = 'score-' + id
        el.dataset.index  = idx
        el.value = score[idx] ? score[idx] : ''
      })
      
      container.append(item)
    })

    document.querySelector('#gameContainer').addEventListener('focus', e => {
      if (e.target.tagName === 'INPUT') {
        console.log(e.target.id)
        lastFocus = e.target.id
      }
    }, {capture: true})
  }

  const handleSubmitGame = (e) => {
    e.preventDefault()
    
    const newArray = saveGames.map(game => {
      const newPlayer = game.player.map((name, idx) => {
        const el = document.querySelector(`[data-id="name-${game.id}"][data-index="${idx}"]`)
        return name === el.value ? name : el.value
      })
      const newScore = game.score.map((score, idx) => {
        const el = document.querySelector(`[data-id="score-${game.id}"][data-index="${idx}"]`)
        return score === el.value ? score : el.value
      })
      return {...game, player: [...newPlayer], score: [...newScore]}
    })

    update(ref(db, `${docs}${gameId}`), {
      games: newArray,
    }).then(() => {
      console.log('update')
      document.querySelector(`#${lastFocus}`).focus()
    })
    //
  }

  const Tbody = (props) => {
    console.log('pros', props)
    return (
      <tbody>
        <tr>
          <td>asfas</td>
        </tr>
      </tbody>
    )
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
    <div>
      <form onSubmit={handleSubmitGame}>
        <div id="gameContainer"></div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>번호</th>
                <th>코트</th>
                <th>사간</th>
                <th>페어 A</th>
                <th>페어 B</th>
                <th>스코어</th>
                <th>삭제</th>
              </tr>
            </thead>
          </table>
          {setElement(saveGames)}
          <input type="submit" value="게임 저장" />
        </div>
      </form>
    </div>
  )
}

export default GameDetail
