import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import {
  push,
  ref,
  set,
  onValue,
  query,
  orderByChild,
  remove,
} from 'firebase/database'
// import { Link } from 'react-router-dom'

const gameItemTemplate = `
  <div class="game-head">게임 진행 시간: <span clsssName="game-time">12:00</span></div>
  <div class="d-flex">
    <div class="input-wrap">
      <div class="col">
        <input type="text" class="player" />
        <input type="text" class="player" />
        <input type="text" class="player" />
        <input type="text" class="player" />
      </div>
      <div class="col">
        
      </div>
    </div>
  </div>`

const Game = ({ userObj }) => {
  const auth = userObj.email === 'jeonghak.hur@gmail.com' ? true : false
  const [gameData, setGameData] = useState([])
  const [court, setCourt] = useState({})
  const [gameList, setGameList] = useState([])
  const gameListRef = ref(db, `reactTennis/games/`)
  const newGameListRef = push(gameListRef)
  const now = new Date()
  const year = now.getFullYear()
  let month = now.getMonth() + 1
  let date = now.getDate()
  if (month < 10) {
    month = 0 + String(month)
  }

  if (date < 10) {
    date = 0 + String(date)
  }

  const readGame = () => {
    onValue(query(gameListRef, orderByChild('date')), (snapshot) => {
      const newArray = []
      snapshot.forEach((child) => {
        newArray.push({
          id: child.key,
          date: child.val().date,
          name: child.val().name,
        })
      })
      setGameList(newArray.reverse())
    })
  }

  const [gameDate, setGameDate] = useState(`${year}-${month}-${date}`)

  const handleChangeGameDate = (e) => {
    setGameDate(e.target.value)
  }

  const handleClickCourtAdd = () => {
    const container = document.querySelector('#courtListContainer')
    const template = document.querySelector('.court-list')
    const clone = template.cloneNode(true)
    const div = document.createElement('div')
    const button = document.createElement('button')
    const uId = 'courtList-' + ~~(Math.random() * 1000000)
    clone.id = uId
    button.type = 'button'
    button.textContent = '삭제'

    button.addEventListener('click', () => {
      const confirm = window.confirm('정말로 삭제하시겠습니까?')
      if (confirm) {
        clone.remove()
        handleSubmitGameCreate()
      }
      return
    })

    clone.appendChild(button)
    container.appendChild(clone)
  }

  const handleSubmitGameCreate = (e) => {
    if (e) {
      e.preventDefault()
    }

    const courtName = document.querySelector('input[name="courtName"]')
    const courtTimeMove = document.querySelector('input[name="courtTimeMove"]')

    const courtNumber = [
      ...document.querySelectorAll('input[name="courtNumber"]'),
    ]
    const courtTimeStartHour = [
      ...document.querySelectorAll('input[name="courtTimeStartHour"]'),
    ]
    const courtTimeStartMinute = [
      ...document.querySelectorAll('input[name="courtTimeStartMinute"]'),
    ]
    const courtTimeEndHour = [
      ...document.querySelectorAll('input[name="courtTimeEndHour"]'),
    ]
    const courtTimeEndMinute = [
      ...document.querySelectorAll('input[name="courtTimeEndMinute"]'),
    ]

    const moveTime = Number(courtTimeMove.value)

    if (moveTime < 20 || moveTime > 40) {
      alert('게임 진행시간은 20분 이상 40분 이하로 작성해주세요')
      courtTimeMove.focus()
    }

    const numberArr = []
    const newObj = {
      date: gameDate,
      name: courtName.value,
      moveTime,
      court: [],
    }

    for (let i = 0; i < courtNumber.length; i += 1) {
      numberArr.push(courtNumber[i].value)
    }

    for (let i = 0; i < courtNumber.length; i += 1) {
      const number = courtNumber[i].value
      const numberFirst = numberArr.indexOf(number)
      const numberLast = numberArr.lastIndexOf(number)
      const startHour = Number(courtTimeStartHour[i].value)
      const startMinute = Number(courtTimeStartMinute[i].value)
      const endHour = Number(courtTimeEndHour[i].value)
      const endMinute = Number(courtTimeEndMinute[i].value)
      const startTime = new Date(
        year,
        month - 1,
        date,
        courtTimeStartHour[i].value,
        courtTimeStartMinute[i].value
      ).getTime()
      const endTime = new Date(
        year,
        month - 1,
        date,
        courtTimeEndHour[i].value,
        courtTimeEndMinute[i].value
      ).getTime()

      if (numberFirst !== numberLast) {
        alert('동일한 코드 번호가 있습니다.')
        courtNumber[numberLast].focus()
        return
      }

      if (endTime - startTime < moveTime) {
        alert('게임 가능 시간을 확인해 주세요.')
        courtTimeStartHour[i].focus()
        return
      }

      newObj.court.push({
        number,
        startHour,
        startMinute,
        endHour,
        endMinute,
      })
    }
    console.log(newObj)
    if (JSON.stringify(newObj) !== JSON.stringify(court)) {
      setCourt(newObj)
      saveData(newObj)
    }
  }

  const setCreateGame = (court) => {
    console.log('gameData', gameData)
    const newArray = []
    court.forEach((obj) => {
      const { name, number, move, startTime, endTime } = obj
      const moveTime = move * 60 * 1000
      const len = (endTime - startTime) / moveTime

      for (let i = 0; i < len; i += 1) {
        const s = startTime + moveTime * i
        newArray.push({
          id: i,
          number,
          startTime: s,
          endTime: s + moveTime,
        })
      }

      newArray.sort((a, b) => {
        if (a.startTime < b.startTime) {
          return -1
        }
        return 0
      })
    })

    // console./log('newArray', newArray, gameData)

    if (JSON.stringify(newArray) !== JSON.stringify(gameData)) {
      setGameData(newArray)
    }
  }

  const setElement = () => {
    document.querySelector('#gameList').innerHTML = ''
    const gameListEl = document.querySelector('#gameList')
    gameData.forEach((game) => {
      const { id, name, number, startTime, endTime } = game
      const item = document.createElement('div')
      item.id = 'gameList-' + id
      item.classList.add('game-item')
      item.innerHTML = gameItemTemplate
      const head = item.querySelector('.game-head')
      const startDate = new Date(startTime)
      const endDate = new Date(endTime)
      let startHour = startDate.getHours()
      let startMinute = startDate.getMinutes()
      let endHour = endDate.getHours()
      let endMinute = endDate.getMinutes()
      startHour = startHour < 10 ? '0' + startHour : startHour
      startMinute = startMinute < 10 ? '0' + startMinute : startMinute
      endHour = endHour < 10 ? '0' + endHour : endHour
      endMinute = endMinute < 10 ? '0' + endMinute : endMinute

      head.textContent = `${name}-${number} ${startHour}:${startMinute}~${endHour}:${endMinute}`
      gameListEl.appendChild(item)
    })
  }

  const saveData = (data) => {
    if (!Object.keys(data).length) return
    set(newGameListRef, {
      ...data,
      time: new Date().getTime(),
    })
  }

  const deleteData = (id) => {
    const confirm = window.confirm('정말로 삭제하시겠습니까?')
    if (!confirm) return
    remove(ref(db, 'reactTennis/games/' + id))
  }

  useEffect(() => {
    // console.log(gameData)
    // saveData()
    readGame()
    // setElement()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [court])

  //

  return (
    <div>
      {auth && (
        <form onSubmit={handleSubmitGameCreate}>
          <div id="courtListContainer" className="court-wrap">
            <div className="row">
              <input
                name="gameDate"
                type="date"
                value={gameDate}
                onChange={handleChangeGameDate}
              />
              <input
                type="text"
                name="courtName"
                defaultValue="그랜드슬램"
                required
              />
              <input
                name="courtTimeMove"
                type="number"
                placeholder="진행 시간"
                defaultValue="30"
                required
              />
            </div>
            <div className="row court-list">
              <input
                name="courtNumber"
                type="text"
                placeholder="코트 번호 입력"
                defaultValue="A"
                required
              />
              <input
                name="courtTimeStartHour"
                type="number"
                defaultValue={19}
                placeholder="시작 시간"
                required
              />
              {/* : */}
              <input
                name="courtTimeStartMinute"
                type="number"
                placeholder="시작 분"
                defaultValue="00"
                required
              />
              <input
                name="courtTimeEndHour"
                type="number"
                placeholder="종료 시간 입력"
                defaultValue="23"
                required
              />
              {/* : */}
              <input
                name="courtTimeEndMinute"
                type="number"
                placeholder="종료 분 입력"
                defaultValue="00"
                required
              />
            </div>
          </div>
          <div className="row">
            <button type="button" onClick={handleClickCourtAdd}>
              코트 추가
            </button>
            <input type="submit" value="게임 생성" id="submit" />
          </div>
        </form>
      )}

      {/* <div id="gameContainer">
        <form onSubmit={handleSubmitGameSave}>
          <div id="gameList"></div>
          <input type="submit" value="게임 저장" />
        </form>
      </div> */}
      {/* <p>
        <Link to="/games/1">Link 1</Link>
      </p> */}
      <div className="game-list">
        <table className="table">
          <thead>
            <tr>
              <th>번호</th>
              <th>날짜</th>
              <th>코트명</th>
              {auth && <th>삭제</th>}
            </tr>
          </thead>
          <tbody>
            {gameList.map((game, idx) => (
              <tr key={game.id}>
                <td>{gameList.length - idx}</td>
                <td>
                  <Link to={`/games/${game.id}`}>{game.date}</Link>
                </td>
                <td>{game.name}</td>
                {auth && (
                  <td>
                    <button type="button" onClick={() => deleteData(game.id)}>
                      삭제
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Game
