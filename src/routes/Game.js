import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'

const gameItemTemplate = `
  <div class="game-head">게임 진행 시간: <span clsssName="game-time">12:00</span></div>
    <div class="d-flex">
      <div class="input-wrap">
        <div class="col">
          <input type="text" name="game-name-a" />
          <input type="text" name="game-name-a" />
          <input type="number" name="score-a" />
        </div>
        <div class="col">
          <input type="text" name="game-name-b" />
          <input type="text" name="game-name-b" />
          <input type="number" name="score-b" / >
        </div>
      </div>
      <button type="button" class="btn-delete">삭제</button>
    </div>
  </div>`

const Game = () => {
  // const court = []
  // const games = []
  const [games, setGames] = useState([])
  const now = new Date()
  const year = now.getFullYear()
  let month = now.getMonth() + 1
  const date = now.getDate()
  if (month < 10) {
    month = 0 + String(month)
  }

  const [gameDate, setGameDate] = useState(`${year}-${month}-${date}`)

  // const hourOption = Array(24).fill(0).map((v, i) => {
  //   return (<option key={i} value={i}>{i < 10 ? `0${i}`: i}</option>)
  // })

  // const minuteOption = Array(6).fill(0).map((v, i) => {
  //   const value = 10 * i
  //   return (<option key={value} value={value}>{value < 10 ? `0${value}`: value}</option>)
  // })

  // const [courtInfo, setCourtInfo] = useState([])

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
      }
      return
    })

    div.appendChild(button)
    clone.appendChild(div)
    container.appendChild(clone)
  }

  const handleSubmitGameCreate = (e) => {
    e.preventDefault()

    const court = []

    const courtName = document.querySelectorAll('input[name="courtName"]')
    const courtTimeMove = document.querySelectorAll('input[name="courtTimeMove"]')
    const courtTimeStartHour = document.querySelectorAll('input[name="courtTimeStartHour"]')
    const courtTimeStartMinute = document.querySelectorAll('input[name="courtTimeStartMinute"]')
    const courtTimeEndHour = document.querySelectorAll('input[name="courtTimeEndHour"]')
    const courtTimeEndMinute = document.querySelectorAll('input[name="courtTimeEndMinute"]')

    const len = courtName.length

    
    
    for(let i = 0; i < len; i += 1) {
      const obj = {
        name: courtName[i].value,
        move: courtTimeMove[i].value,
        startTime: new Date(year, month - 1, date, courtTimeStartHour[i].value, courtTimeStartMinute[i].value).getTime(),
        endTime: new Date(year, month - 1, date, courtTimeEndHour[i].value, courtTimeEndMinute[i].value).getTime(),
      }
      court.push(obj)
    }

    // 입력값 검사
    (() => {
      const nameArr = []
      const moveArr = []
      const startTime = []
      const endTime = []

      court.forEach(obj => {
        nameArr.push(obj.name)
        moveArr.push(obj.move)
        startTime.push(obj.startTime)
        endTime.push(obj.endTime)
      })

      for (let i = 0; i < nameArr.length; i += 1) {
        const name = nameArr[i]
        const first = nameArr.indexOf(name)
        const last = nameArr.lastIndexOf(name)

        if (first !== last) {
          const focusEl = courtName[last]
          alert('동일한 코트 명이 있습니다.')
          focusEl.focus()
          return
        }

        const move = Number(moveArr[i])
        const moveEl = courtTimeMove[i]
        if (!move) {
          alert('게임 진행 시간을 입력해주세요')
          moveEl.focus()
          return
        }

        if (move < 20 || move > 40) {
          alert('게임 진행 시간은 최소 20분 이상 최대 40분 이하로 입력해주세요')
          moveEl.focus()
          return
        }

        const moveTime = move * 60 * 1000
        if (endTime[i] - startTime[i] < moveTime) {
          alert('게임 가능 시간을 체크해 주세요')
          courtTimeStartHour[i].focus()
          return
        }
      }

      setCreateGame(court)
    })()
  }

  const setCreateGame = (court) => {
    document.querySelector('#gameList').innerHTML = ''
    court.forEach(obj => {
      const {name, move, startTime, endTime} = obj
      const moveTime = move * 60 * 1000
      const len = (endTime - startTime) / moveTime
      const newArray = []
      for (let i = 0; i < len; i += 1) {
        const s = startTime + (moveTime * i)
        newArray.push({
          name,
          startTime: s,
          endTime: s + moveTime,
          pair: [],
          player: [],
          score: []
        })
      }

    // 시간 순서로 정렬
      newArray.sort((a, b) => {
        if (a.startTime < b.startTime) {
          return -1
        }
        return 0
      })

      setGames(pre => [...pre, newArray])
    })


    // games.forEach(game => setElement(game))
  }

  const setElement = () => {
    console.log(games)
    // const { startTime, endTime, name } = game
    // const gameListEl = document.querySelector('#gameList')
    // const item = document.createElement('div')
    // item.classList.add('game-item')
    // item.innerHTML = gameItemTemplate
    // const btnDelete = item.querySelector('.btn-delete')

    // const head = item.querySelector('.game-head')
    // const startDate = new Date(startTime)
    // const endDate = new Date(endTime)
    // let startHour = startDate.getHours()
    // let startMinute = startDate.getMinutes()
    // let endHour = endDate.getHours()
    // let endMinute = endDate.getMinutes()
    // startHour = startHour < 10 ? '0' + startHour : startHour
    // startMinute = startMinute < 10 ? '0' + startMinute : startMinute
    // endHour = endHour < 10 ? '0' + endHour : endHour
    // endMinute = endMinute < 10 ? '0' + endMinute : endMinute

    // head.textContent = `${name}:${startHour}:${startMinute}~${endHour}:${endMinute}`
    // gameListEl.appendChild(item)

    // btnDelete.addEventListener('click', () => {
    //   item.remove()
    // })
  }

  const handleSubmitGameSave = (e) => {
    e.preventDefault()
    console.log('game save')
  }

  useEffect(() => {
    setElement()
    // const form = document.querySelector('#submit')
    // form.addEventListener('click', handleSubmitGameCreate)
    // form.dispatchEvent(new Event('click'))
    // console.log(games)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games])

  // 

  return (
    <div>
      <form onSubmit={handleSubmitGameCreate} >
        <div className="form-col">
          <input
            name="gameDate"
            type="date"
            value={gameDate}
            onChange={handleChangeGameDate}
            className="mr-1"
          />
          <button type="button" onClick={handleClickCourtAdd}>
            코트추가
          </button>
        </div>
        <div id="courtListContainer">
          <div className="form-row court-list">
            <div className="form-col d-f">
              <input
                name="courtName"
                type="text"
                placeholder="코트명 입력"
                defaultValue="A"
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
            <div className="form-col d-f">
              <input
                name="courtTimeStartHour"
                type="number"
                defaultValue="19"
                placeholder="시작 시간"
                required
              />
              :
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
              :
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
          <input type="submit" value="게임생성" id="submit" />
        </div>
      </form>
      <div id="gameContainer">
        <form onSubmit={handleSubmitGameSave}>
          <div id="gameList"></div>
          <input type="submit" value="게임저장" />
        </form>
        
        
      </div>
      {/* <p>
        <Link to="/games/1">Link 1</Link>
      </p> */}
    </div>
  )
}

export default Game
