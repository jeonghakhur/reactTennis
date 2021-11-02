import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { push, ref, set, onValue } from 'firebase/database'
// import { Link } from 'react-router-dom'

const gameItemTemplate = `
  <div class="game-head">게임 진행 시간: <span clsssName="game-time">12:00</span></div>
    <div class="d-flex">
      <div class="input-wrap">
        <div class="col">
          <input type="text" class="player" />
          <input type="text" class="player" />
        </div>
        <div class="col">
          <input type="text" class="player" />
          <input type="text" class="player" />
        </div>
      </div>
    </div>
  </div>`

const Game = () => {
  const [gameData, setGameData] = useState([])
  const [court, setCourt] = useState([])
  const gameList = []
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
    onValue(gameListRef, (snapshot) => {
      snapshot.forEach((child) => {
        gameList.push({
          id: child.key,
        })
      })
    })

    console.log(gameList)
  }
  readGame()

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
    div.classList.add('d-f', 'row')
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

    div.appendChild(button)
    clone.appendChild(div)
    container.appendChild(clone)
  }

  const handleSubmitGameCreate = (e) => {
    if (e) {
      e.preventDefault()
    }

    const courtName = document.querySelector('input[name="courtName"]')
    const courtTimeMove = document.querySelector(
      'input[name="courtTimeMove"]'
    )

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

    const moveTime = courtTimeMove.value * 60 * 1000

    if (moveTime < (20 * 60 * 1000) || moveTime> (40 * 60 * 1000)) {
      alert('게임 진행시간은 20분 이상 40분 이하로 작성해주세요')
      courtTimeMove.focus()
    }

    const numberArr = []
    const newObj = {
      date: gameDate,
      name: courtName.value,
      moveTime,
      court: []
    }

    for(let i = 0; i < courtNumber.length; i += 1) {
      numberArr.push(courtNumber[i].value)
    }

    for(let i = 0; i < courtNumber.length; i += 1) {
      const number = courtNumber[i].value
      const numberFirst = numberArr.indexOf(number)
      const numberLast = numberArr.lastIndexOf(number)
      const startHour = courtTimeStartHour[i].value
      const startMinute = courtTimeStartMinute[i].value
      const endHour = courtTimeEndHour[i].value
      const endMinute = courtTimeEndMinute[i].value
      const startTime = new Date(
        year,
        month - 1,
        date,
        courtTimeStartHour[i].value,
        courtTimeStartMinute[i].value
      ).getTime()
      const endTime =  new Date(
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



    // const len = courtName.length
    // const newArray = []
    // for (let i = 0; i < len; i += 1) {
    //   const obj = {
    //     name: courtName[i].value,
    //     number: courtNumber[i].value,
    //     move: courtTimeMove[i].value,
    //     startTime: new Date(
    //       year,
    //       month - 1,
    //       date,
    //       courtTimeStartHour[i].value,
    //       courtTimeStartMinute[i].value
    //     ).getTime(),
    //     endTime: new Date(
    //       year,
    //       month - 1,
    //       date,
    //       courtTimeEndHour[i].value,
    //       courtTimeEndMinute[i].value
    //     ).getTime(),
    //   }

    //   newArray.push(obj)
    // }

    // // 입력값 검사
    // ;(() => {
    //   const nameArr = []
    //   const numberArr = []
    //   const moveArr = []
    //   const startTime = []
    //   const endTime = []

    //   newArray.forEach((obj) => {
    //     nameArr.push(obj.name)
    //     numberArr.push(obj.number)
    //     moveArr.push(obj.move)
    //     startTime.push(obj.startTime)
    //     endTime.push(obj.endTime)
    //   })

    //   for (let i = 0; i < nameArr.length; i += 1) {
    //     const name = nameArr[i]
    //     const number = numberArr[i]
    //     const nameFirst = nameArr.indexOf(name)
    //     const nameLast = nameArr.lastIndexOf(name)
    //     const numberFirst = numberArr.indexOf(number)
    //     const numberLast = numberArr.lastIndexOf(number)

    //     if (nameFirst !== nameLast && numberFirst !== numberLast) {
    //       const focusEl = courtNumber[numberLast]
    //       alert('동일한 코트 명이 있습니다.')
    //       focusEl.focus()
    //       return
    //     }

    //     const move = Number(moveArr[i])
    //     const moveEl = courtTimeMove[i]
    //     if (!move) {
    //       alert('게임 진행 시간을 입력해 주세요')
    //       moveEl.focus()
    //       return
    //     }

    //     if (move < 20 || move > 40) {
    //       alert(
    //         '게임 진행 시간은 최소 20분 이상 최대 40분 이하로 입력해 주세요'
    //       )
    //       moveEl.focus()
    //       return
    //     }

    //     const moveTime = move * 60 * 1000
    //     if (endTime[i] - startTime[i] < moveTime) {
    //       alert('게임 가능 시간을 체크해 주세요')
    //       courtTimeStartHour[i].focus()
    //       return
    //     }
    //   }

    //   // setCreateGame(court)
    // })()
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

  // const handleSubmitGameSave = (e) => {
  //   e.preventDefault()
  //   const gameList = document.querySelectorAll('.game-item')
  //   gameList.forEach((el) => {
  //     const id = Number(el.id.replace('gameList-', ''))
  //     const player = {}
  //     el.querySelectorAll('.player').forEach((input, idx) => {
  //       if (input.value) {
  //         player[idx] = input.value
  //       }
  //     })

  //     if (Object.keys(player).length) {
  //       // setGameData(gameData.map(game => game.id === id? {... game, player} : game))
  //       setGameData(gameData.map(game => game.id === id? {... game, player} : game))
  //     }
  //   })
  // }

  const saveData = () => {
    if (!gameData.length) return
    set(newGameListRef, gameData)
  }

  useEffect(() => {
    // console.log(gameData)
    // setElement()
    saveData()
    // console.log(gameData.key)
    // setElement()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData, gameDate])

  //

  return (
    <div>
      <form onSubmit={handleSubmitGameCreate}>
        <div id="courtListContainer">
          <div className="form-col">
            <div className="court-date">
              <input
                name="gameDate"
                type="date"
                value={gameDate}
                onChange={handleChangeGameDate}
              />
            </div>
            <div className="court-name">
              <input
                type="text"
                name="courtName"
                defaultValue="그랜드슬램"
                required
              />
            </div>
            <div className="court-time-move">
              <input
                name="courtTimeMove"
                type="number"
                placeholder="진행 시간"
                defaultValue="30"
                required
              />
            </div>
          </div>
          <div className="form-row court-list">
            <div className="form-col d-f">
              <div className="court-number">
                <input
                  name="courtNumber"
                  type="text"
                  placeholder="코트 번호 입력"
                  defaultValue="A"
                  required
                />
              </div>
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
        </div>
        <div className="d-f row">
          <button type="button" onClick={handleClickCourtAdd}>
            코트 추가
          </button>
          <input type="submit" value="게임 생성" id="submit" />
        </div>
      </form>
      {/* <div id="gameContainer">
        <form onSubmit={handleSubmitGameSave}>
          <div id="gameList"></div>
          <input type="submit" value="게임 저장" />
        </form>
      </div> */}
      {/* <p>
        <Link to="/games/1">Link 1</Link>
      </p> */}
    </div>
  )
}

export default Game
