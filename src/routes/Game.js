import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'

const gameItemTemplate = `
  <div className="game-item">
  <div className="game-head">게임 진행 시간: <span clsssName="game-time">12:00</span></div>
  <div className="d-f row">
    <input type="text" name="game-name-a" />
    <input type="text" name="game-name-a" />
    <span className="fg-n">vs</span>
    <input type="text" name="game-name-b" />
    <input type="text" name="game-name-b" />
  </div>
  <div className="d-f row">
    <input type="number" name="score-a" />
    <input type="number" name="score-b" />
    <button type="button" className="btn-delete">삭제</button>
    <button type="button" className="btn-save">저장</button>
  </div>
  </div>`

const Game = () => {
  // const court = []
  // const games = []
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
    const template = document.querySelector('#gameList')
    const clone = template.cloneNode(true)
    const div = document.createElement('div')
    const button = document.createElement('button')
    const uId = 'gameList-' + ~~(Math.random() * 1000000)
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
    // console.log(court)

    // 코트명 중복 검사
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
    })()

    // const mapValue = els => {
    //   if (!els) return
    //   return [].map.call(els, el => el.value)
    // }

    // const court = {
    //   name: mapValue(courtName),
    //   move: mapValue(courtTimeMove),
    //   startTime: [],
    //   startHour: mapValue(courtTimeStartHour),
    //   startMinute: mapValue(courtTimeStartMinute),
    //   endTime: [],
    //   endHour: mapValue(courtTimeEndHour),
    //   endMinute: mapValue(courtTimeEndMinute)
    // }

    // function isDuplicate(arr) {
    //   let isDup = false
    //   for (let i = 0; i < arr.length; i += 1) {
    //     if (arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])) {
    //       isDup = arr.lastIndexOf(arr[i])
    //       break
    //     } else {
    //       isDup = false
    //     }
    //   }
    //   return isDup
    // }

    // // 코트명이 동일한 경우 리턴
    // const isDupCourt = isDuplicate(court.name)
    // if (isDupCourt) {
    //   const returnEl = document.querySelectorAll('[name="courtName"]')[isDupCourt]
    //   alert('코크명이 동잏합니다.')
    //   returnEl.focus()
    //   return
    // }

    // // 게임 시간이 작성 안된 경우 리턴
    // court.move.forEach((move, idx) => {
    //   const minute = Number(move)
    //   const focusEl = document.querySelectorAll('[name="courtTimeMove"]')[idx]
    //   if (!minute) {
    //     alert('게임 진행 시간을 입력해주세요')
    //     focusEl.focus()
    //     return 
    //   }

    //   if (minute < 20 || minute > 40) {
    //     alert('게임 진행 시간은 최소 20분에서 최대 40분 입니다.')
    //     focusEl.focus()
    //     return
    //   }
    // })

    // // 게임 종료 시간이 시작 시간 보다 작거나 같은 지 체크
    // court.startHour.forEach((startHour, idx) => {
    //   const {endHour, startMinute, endMinute} = court
    //   const startTime = new Date(year, month - 1, date, startHour, startMinute).getTime()
    //   const endTime = new Date(year, month - 1, date, endHour, endMinute).getTime()
    //   const moveTime = court.move[idx] * 60 * 1000
    //   console.log()
    //   if (endTime - startTime < moveTime) {
    //     alert('게임 가능 시간을 확인해 주세요')
    //     return
    //   }
    //   court.startTime.push(startTime)
    //   court.endTime.push(endTime)
    // })
//
    setCreateGame(court)
  }

  const setCreateGame = (court) => {
    // const contanier = document.querySelector('#gameList')
    // const template = gameItemTemplate
    // const games = []
      
    // court.forEach(obj => {

    //   const len = (court.endTime[idx] - st) / (court.move[idx] * 60 * 1000)
    //   console.log('len', len, st)
    //   for(let i = 0; i < len; i += 1) {
    //     console.log('idx', idx, i)
    //   }
      
    // })
    
  }

  useEffect(() => {
    const form = document.querySelector('#submit')
    form.addEventListener('click', handleSubmitGameCreate)
    form.dispatchEvent(new Event('click'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


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
          <div className="form-row court-list" id="gameList">
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
          <button type="button">게임저장</button>
        </div>
      </form>
      <div id="gameContainer">
        <div id="gameList"></div>
      </div>
      {/* <p>
        <Link to="/games/1">Link 1</Link>
      </p> */}
    </div>
  )
}

export default Game
