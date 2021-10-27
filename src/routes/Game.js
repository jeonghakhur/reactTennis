import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Game = () => {
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

  const handleClickGameCreate = () => {
    const courtName = document.querySelectorAll('input[name="courtName"]')
    const courtTimeMove = document.querySelectorAll('input[name="courtTimeMove"]')
    const courtTimeStart = document.querySelectorAll('input[name="courtTimeStart"]')
    const courtTimeEnd = document.querySelectorAll('input[name="courtTimeEnd"]')
    console.log(courtTimeStart[0].value)

    const mapValue = els => {
      return [].map.call(els, el => el.value)
    }

    const court = {
      name: mapValue(courtName),
      move: mapValue(courtTimeMove),
      start: mapValue(courtTimeStart),
      end: mapValue(courtTimeEnd)
    }

    console.log(court)

  }

  return (
    <div>
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
        <button type="button" onClick={handleClickGameCreate}>게임 생성</button>
      </div>
      <div id="courtListContainer">
        <div className="form-row court-list" id="gameList">
          <div className="form-col d-f">
            <input
              name="courtName"
              type="text"
              placeholder="코트명 입력"
              required
            />
            <input
              name="courtTimeMove"
              type="number"
              placeholder="진행 시간"
              required
            />
          </div>
          <div className="form-col d-f">
            <input
              name="courtTimeStartHour"
              type="number"
              value="19"
              placeholder="시작 시간"
              required
            />
            :
            <input
              name="courtTimeStartMinute"
              type="number"
              placeholder="시작 분"
              value="00"
              required
            />
            <input
              name="courtTimeEndHour"
              type="number"
              placeholder="종료 시간 입력"
              value="23"
              required
            />
            :
            <input
              name="courtTimeEndMinute"
              type="number"
              placeholder="종료 분 입력"
              value="00"
              required
            />
          </div>
        </div>
      </div>
      <div className="d-f row">
        <button type="button">게임저장</button>
      </div>
      <p>
        <Link to="/games/1">Link 1</Link>
      </p>
    </div>
  )
}

export default Game
