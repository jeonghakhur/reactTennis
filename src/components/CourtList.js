import React , {useState, useEffect, useMemo} from 'react'
import _ from 'lodash'

const CourtList = (props) => {
  
  const { gameId, members, totalGames } = props
  const [currentGames, setCurrentGames] = useState(false)


  const getPlayer = (date, startTime, endTime) => {
    let newMembers = members.filter(member => {
      // console.log(member)
      const memberStartTime = new Date(date[0], date[1] - 1, date[2], member.startHour, member.startMinute).getTime()
      const memberEndTime = new Date(date[0], date[1] - 1, date[2], member.endHour, member.endMinute).getTime()
      member.players.sort((a, b) => a.pair - b.pair)
      if (startTime >= memberStartTime && endTime <= memberEndTime) return member
    })

    

    // newMembers.sort(() => Math.random() - Math.random())

    const player1 = newMembers[0]
    const player2 = _.minBy(_.sortBy(player1.players, 'count'), 'pair')
    const player3 = _.minBy(_.filter(player1.players, player => player.name !== player2.name), 'notPair')
    const player4 = _.filter(player1)
    console.log(newMembers)

    return newMembers.map(member => member.name)
  }

  const init = (data) => {
    const newArray = []
    const {date, court, moveTime} = data
    const dateArr = date.split('-')

    court.forEach(val => {
      const moveTimeStamp = moveTime * 60 * 1000
      const {number, startHour, startMinute, endHour, endMinute} = val
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

      const gameCount = (endTime - startTime) / moveTimeStamp

      for (let i = 0; i < gameCount; i += 1) {
        const id = `${number}-${i}`
        const gameStartTime = startTime + moveTimeStamp * i
        const gameEndTime = startTime + moveTimeStamp * i + moveTimeStamp
        newArray.push({
          id,
          number,
          startTime: gameStartTime,
          endTime: gameEndTime,
          timeOrder: i,
          player: getPlayer(dateArr, gameStartTime, gameEndTime),
          score: [],
        })
      }
    })

    newArray.sort((a, b) => a.startTime - b.startTime)
    
    setCurrentGames(newArray)
  }

  const getHourMinute = (time) => {
    const date = new Date(time)
    let hour = date.getHours()
    let minute = date.getMinutes()
    hour = hour < 10? '0' + hour : hour
    minute = minute < 10? '0' + minute : minute
    return hour + ' : ' + minute
  }


  // 전체 게임만 추려본다.
  // 전체 게임 중 오늘 참석자만 있는 게임을 추려 본다.

 const test = () => {
  console.log(members)
 }

  useEffect(() => {
    // console.clear()
    console.log('effect')
    if (!members) return
    
    init(totalGames.find(game => game.id === gameId))
    // setPairs(true)
  }, [members])
  

  // const timeMembers = []

  // const getPair = ({id, pair, startTime, endTime}) => {
  //   if (!members) return
  //   const filterArray = members.filter(member => {
  //     const memberStartTime = new Date(date[0], date[1] - 1, date[2], member.startHour, member.startMinute).getTime()
  //     const memberEndTime = new Date(date[0], date[1] - 1, date[2], member.endHour, member.endMinute).getTime()
  //     if (startTime >= memberStartTime && endTime <= memberEndTime) return member
  //   })

  //   const options = filterArray.map(member => ({
  //     key: member.name,
  //     value: member.name
  //   }))

  //   const index = timeMembers.findIndex(val => val.id === startTime)
  //   if (index !== -1) {
  //     timeMembers[index].members.push(options[0].key)
  //   } else {
  //     timeMembers.push({
  //       id: startTime,
  //       members: [options[0].key]
  //     })
  //   }

  //   return (
  //     <>
  //       <Select name="selectPairA-1" options={options} onChange={onChangeSelectMember} />
  //       <Select name="selectPairA-2" options={options} />
  //     </>
  //   )
  // }
  
  // const onChangeScore = () => {
  //   console.log('score')
  // }

  const Select = ({name, options, index = 0, onChange = () => {}}) => {
    return (
      <select name={name} onChange={onChange} defaultValue={index}>
        {options.map(obj => (<option key={obj.key} value={obj.key}>{obj.value}</option>))}
      </select>
    )
  }

  const getScore = (score) => {
    const options = []
    Array.from({length: 7}, (val, idx) => {
      options.push({
        key: idx,
        value: idx
      })
    })
    
    return (
      <>
        <Select name="scoreA" options={options} index={score[0]} />
        <Select name="scoreB" options={options} index={score[1]} />
      </>
    )
  }


  return (
    <div className="scroll-wrap" onClick={test}>
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
        <tbody>
          {currentGames && currentGames.map((game, idx) => {
            return (
            <tr key={game.id}>
              <td>{idx + 1}</td>
              <td>{game.number}</td>
              <td>{getHourMinute(game.startTime)}</td>
              <td>{game.player[0]}{game.player[1]}</td>
              <td></td>
              <td></td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  )
}
{
  /* <form onSubmit={handleSubmitGame}>
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
    <tbody id="gameContainer">
      {games && games.map((game, idx) => {
        console.clear()
        console.log(game)
        return (
          <tr key={game.id}>
            <td>{idx + 1}</td>
            <td>{game.number}</td>
            <td>{getHourMinute(game.startTime)}</td>
          </tr>
        )
      })}
    </tbody>
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
    <button
      button="butotn"
      // value="최종 저장"
      className="btn btn-primary"
      onClick={(e) => {
        handleSubmitGame(e, 'final')
      }}>최종 저장</button>
  )}
</div>
</form> */
}
export default React.memo(CourtList)
