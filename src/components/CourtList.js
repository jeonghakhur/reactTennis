import React , {useState, useEffect, useMemo} from 'react'

const CourtList = (props) => {
  
  const { gameId, members, totalGames } = props
  const [date, setDate] = useState(false)
  const [currentGames, setCurrentGames] = useState(false)


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
        newArray.push({
          id,
          number,
          startTime: startTime + moveTimeStamp * i,
          endTime: startTime + moveTimeStamp * i + moveTimeStamp,
          timeOrder: i,
          player: [],
          score: [],
        })
      }
    })

    newArray.sort((a, b) => a.startTime - b.startTime)
    setDate(dateArr)
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
  const m = useMemo(() => {
    if (!members) return
    const allGames = []
    totalGames.forEach(val => {
      if (!val.games) return
      val.games.forEach(game => {
        if (game.player.indexOf('') === -1) {
          allGames.push(game.player)
        }
      })
    })

    
    const myGames = allGames.filter(member => member.indexOf('허정학') !== -1)

    // console.log('memo',myGames, members)
    return 'a'
  }, [members])

 const test = () => {
  //  console.log('test', members)
 }

  useEffect(() => {
    // console.clear()
    console.log('effect')
    if (!totalGames) return
    init(totalGames.find(game => game.id === gameId))





    // console.log(games)
    // const timeMembers = []


    // const addPlayer = (startTime, endTime) => {
    //   const newMembers = members.filter(member => {
    //     const memberStartTime = new Date(date[0], date[1] - 1, date[2], member.startHour, member.startMinute).getTime()
    //     const memberEndTime = new Date(date[0], date[1] - 1, date[2], member.endHour, member.endMinute).getTime()
    //     if (startTime >= memberStartTime && endTime <= memberEndTime) return member
    //   })

    //   newMembers.sort(() => Math.random() - Math.random())


    //   // 참석 가능한 시간데 인원중 랜덤으로 
    //   // 나와 페어가 가장 적었던
    //   // 나와 상대 페어가 가장 적었던
    //   // 상대 페어와 페어가 가장 적었던.



    //   // timeMembers.forEach(val => {
    //   //   if (val.id === startTime) {
    //   //     for (let i = 0; i < 4; i += 1) {
    //   //       val.player.push(newMembers)
    //   //     }
    //   //   }
    //   // })
    //   const arr = [1, 2, 4]
      
    //   console.log(newMembers)
    // }
    // if (games) {
    //   games.forEach(game => {
    //     const index = timeMembers.findIndex(val => val.id === game.startTime)
    //     if (index !== -1) {
    //       timeMembers[index].player = addPlayer(game.startTime, game.endTime)
    //     } else {
    //       timeMembers.push({
    //         id: game.startTime,
    //         player: addPlayer(game.startTime, game.endTime)
    //       })
    //     }
    //   })
    // }

    // setPairs(true)
  }, [gameId, totalGames])
  

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
              <td></td>
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
