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

  const optionMember = () => {
    console.log('member setting')
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
            players: []
          })
        })
      }

      newArray.forEach(val => {
        newArray.forEach(member => {
          if (val.name !== member.name) {
            val.players.push({
              name: member.name
            })
          }
        })
      })
      
      console.clear()

      const allGames = []
      totalGames.forEach(val => {
        if (!val.games) return
        val.games.forEach(game => {
          allGames.push(game)
        })
      })

      newArray.forEach(member => {
        const {name, players} = member
        players.forEach(player => {
          let pair = 0
          let notPair = 0
          allGames.forEach(val => {
            const indexA = val.player.indexOf(name)
            const indexB = val.player.indexOf(player.name)
            if (indexA === -1 || indexB === -1) return
            if ((indexA === 0 & indexB === 1) || (indexA === 1 && indexB === 0) || (indexA === 2 && indexB === 3) || (indexA === 3 && indexB === 2)) {
              pair += 1
            } else {
              notPair += 1
            }
          })
          player.pair = pair
          player.notPair = notPair
        })
      })

      setMembers(_.sortBy(newArray, ['name']))
      console.log(newArray)
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
    const len = range[1] - range[0]
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
    console.log(name, value)
    setMembers(
      members.map((val, i) =>
        i === idx ? { ...val, [name]: Number(value) } : val
      )
    )
  }

  const handleClickDelMember = (e) => {
    console.log('del')
    const memberRow = document.querySelectorAll('#memberTable tbody tr')
    const parent = e.target.closest('tr')
    const index = _.findIndex(memberRow, (row) => row === parent)
    deleteMember(index)
    // setMembers(members.filter((member, idx) => idx !== index))
  }

  const deleteMember = useCallback(
    (index) => {
      console.log(members)
      setMembers(members.filter((member, idx) => idx !== index))
    },
    [members]
  )

  const handleClickAddMember = (e) => {
    const member = document.querySelector('[name="addMember"]')
    if (!member.value) return
    const rows = e.target.closest('tr')
    const gender = rows.querySelector('[name="addGender"]')

    setMembers([
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
    console.log(members)
    // document.querySelector
  }

  const handleInputUser = (e) => {
    setUserInput(e.target.value)
  }

  const memberCount = useMemo(() => {
    return members.length
  }, [members])

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
                    range={[firstHour + 1, lastHour + 1]}
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
                <td className="game-count"></td>
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
      <div>
        <button type="button" onClick={optionMember}>
          멤버 세팅
        </button>
        참석 멤머 {memberCount}
      </div>
      <CourtList gameId={gameId} members={members} totalGames={totalGames} />
    </div>
  )
}

export default GameDetail
