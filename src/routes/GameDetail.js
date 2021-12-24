import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { db } from '../firebase'
import { ref, onValue } from 'firebase/database'
import CourtList from '../components/CourtList'
import _ from 'lodash'

// const docs = 'reactTennis/games/'

const GameDetail = ({ userObj, totalGames }) => {
  const user = userObj.email ? userObj.email : true
  // eslint-disable-next-line no-unused-vars
  const admin = user === 'jeonghak.hur@gmail.com' ? true : true
  const match = useRouteMatch()
  const gameId = match.params.name
  // const [loadData, setLoadData] = useState()
  const [firstHour, setFirstHour] = useState(false)
  const [lastHour, setLastHour] = useState(false)
  const [members, setMembers] = useState(false)
  const [gameCount, setGameCount] = []
  // const [saveGames, setSaveGames] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [userInput, setUserInput] = useState(false)

  // const [isInit, setIsInit] = useState(false)

  const init = (data) => {
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
            timeOrder: i,
            player: ['', '', '', ''],
            score: ['', ''],
          })
        }
      })
      newArray.sort((a, b) => a.startTime - b.startTime)
    }

    getMember(court)
    // setSaveGames(newArray)
  }

  const setOtherMembers = (members) => {
    members.forEach((val) => {
      val.players = []
      members.forEach((member) => {
        if (val.name !== member.name) {
          val.players.push({
            name: member.name,
          })
        }
      })
    })

    const allGames = []
    totalGames.forEach((val) => {
      if (!val.games) return
      val.games.forEach((game) => {
        allGames.push(game)
      })
    })

    members.forEach((member) => {
      const { name, players } = member
      players.forEach((player) => {
        let pair = 0
        let notPair = 0
        allGames.forEach((val) => {
          const indexA = val.player.indexOf(name)
          const indexB = val.player.indexOf(player.name)
          if (indexA === -1 || indexB === -1) return
          if (
            (indexA === 0) & (indexB === 1) ||
            (indexA === 1 && indexB === 0) ||
            (indexA === 2 && indexB === 3) ||
            (indexA === 3 && indexB === 2)
          ) {
            pair += 1
          } else {
            notPair += 1
          }
        })
        player.pair = pair
        player.notPair = notPair
        player.count = 0
        // player.gender = gender
      })
    })

    setMembers(_.sortBy(members, ['name']))
  }

  const getMember = (court) => {
    console.log('getMember')
    let startHour = []
    let startMinute = []
    let endHour = []
    let endMinute = []
    court.forEach((val) => {
      startHour.push(val.startHour)
      startMinute.push(val.startMinute)
      endHour.push(val.endHour)
      endMinute.push(val.endMinute)
    })

    startHour = Math.min(...startHour)
    startMinute = Math.min(...startMinute)
    endHour = Math.max(...endHour)
    endMinute = Math.min(...endMinute)

    setFirstHour(startHour)
    setLastHour(endHour)

    onValue(ref(db, '/reactTennis/members/'), (snapshot) => {
      const newArray = []
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          newArray.push({
            ...child.val(),
            startHour,
            startMinute,
            endHour,
            endMinute,
            count: [],
            players: [],
          })
        })
      }

      setOtherMembers(newArray)
    })
  }

  // const handleSubmitGame = (e, final) => {
  //   e.preventDefault()

  //   const newArray = saveGames.map((game) => {
  //     const newPlayer = game.player.map((name, idx) => {
  //       const el = document.querySelector(
  //         `[data-id="name-${game.id}"][data-index="${idx}"]`
  //       )
  //       return name === el.value ? name : el.value
  //     })
  //     const newScore = game.score.map((score, idx) => {
  //       const el = document.querySelector(
  //         `[data-id="score-${game.id}"][data-index="${idx}"]`
  //       )
  //       return score === el.value ? score : el.value
  //     })
  //     return {
  //       ...game,
  //       player: [... newPlayer],
  //       score: [... newScore],
  //     }
  //   })

  //   update(ref(db, `${docs}${gameId}`), {
  //     games: newArray,
  //     final: final ? true : false,
  //     write: user,
  //     saveTime: new Date().getTime(),
  //   }).then(() => {
  //     alert('update')
  //   })
  //   //
  // }

  useEffect(() => {
    if (!totalGames) return

    const selectGame = totalGames.filter((val) => val.id === gameId)
    init(selectGame[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalGames])

  const Select = ({ name, range, step, value, idx }) => {
    let label = false
    let key = false
    const len = range[1] + 1 - range[0]

    const options = Array.from({ length: len }, (val, i) => {
      if (typeof step === 'number') {
        key = (range[0] + i) * step
        label = key < 10 ? '0' + key : key
      }

      return {
        key,
        label,
      }
    })

    // console.log(options)

    return (
      <select
        name={name}
        onChange={(e) => handleSelectChange(e, idx)}
        value={value}
        className="select"
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  const handleSelectChange = (e, idx) => {
    // console.clear()
    const { value, name } = e.target
    setMembers(
      members.map((val, i) =>
        i === idx ? { ...val, [name]: Number(value) } : val
      )
    )
  }

  const handleClickDelMember = (e) => {
    const memberRow = document.querySelectorAll('#memberTable tbody tr')
    const parent = e.target.closest('tr')
    const index = _.findIndex(memberRow, (row) => row === parent)
    setOtherMembers(members.filter((member, idx) => idx !== index))
  }

  const handleClickAddMember = (e) => {
    const member = document.querySelector('[name="addMember"]')
    if (!member.value) return
    const rows = e.target.closest('tr')
    const gender = rows.querySelector('[name="addGender"]')

    setOtherMembers([
      ...members,
      {
        gender: gender.value,
        name: member.value,
        startHour: firstHour,
        startMinute: 0,
        endHour: lastHour,
        endMinute: 0,
      },
    ])
    // document.querySelector
  }

  const handleInputUser = (e) => {
    setUserInput(e.target.value)
  }


  const handleGameCount = (data) => {
    data.forEach(val => {
      const cell = document.querySelector(`#gameCount-${val.name}`)
      cell.textContent = val.count.sort((a, b) => a - b)
    })
    // setGameCount(data)
    // console.log(data)
    // setGameCount(data)
  }

  return (
    <div className="game-detail">
      <table className="table" id="memberTable">
        <thead>
          <tr>
            <th>번호</th>
            <th>참석자</th>
            <th>시작 시간</th>
            <th>종료시간</th>
            <th>참석 게임</th>
            <th>삭제</th>
          </tr>
        </thead>

        <tbody>
          {members &&
            members.map((val, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  {val.name}({val.gender === 'M' ? '남' : '여'})
                </td>
                <td>
                  <Select
                    name="startHour"
                    range={[firstHour, lastHour]}
                    step={1}
                    value={val.startHour}
                    idx={idx}
                  />
                  <span className="text-div">:</span>
                  <Select
                    name="startMinute"
                    range={[0, 2]}
                    step={30}
                    value={val.startMinute}
                    idx={idx}
                  />
                </td>
                <td>
                  <Select
                    name="endHour"
                    range={[firstHour, lastHour]}
                    step={1}
                    value={val.endHour}
                    idx={idx}
                  />
                  <span className="text-div">:</span>
                  <Select
                    name="endMinute"
                    range={[0, 2]}
                    step={30}
                    value={val.endMinute}
                    idx={idx}
                  />
                </td>
                <td className="game-count" id={`gameCount-${val.name}`}></td>
                <td>
                  <button
                    type="button"
                    className=""
                    onClick={handleClickDelMember}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          <tr>
            <td>-</td>
            <td>
              <input
                type="text"
                name="addMember"
                placeholder="이름"
                className="w-50"
                onChange={handleInputUser}
              />
              <select name="addGender" title="성별" className="ml-1">
                <option value="M">남</option>
                <option value="F">여</option>
              </select>
            </td>
            <td colSpan="3" className="ta-l">
              <button
                type="button"
                className="btn-small"
                onClick={handleClickAddMember}
              >
                추가
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <CourtList gameId={gameId} members={members} totalGames={totalGames} onGameData={handleGameCount} />
    </div>
  )
}

export default GameDetail
