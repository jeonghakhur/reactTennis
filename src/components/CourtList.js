import React , {useState} from 'react'

const CourtList = (props) => {
  console.clear()
  const { games, members, date } = props

  const getHourMinute = (time) => {
    const date = new Date(time)
    let hour = date.getHours()
    let minute = date.getMinutes()
    hour = hour < 10? '0' + hour : hour
    minute = minute < 10? '0' + minute : minute
    return hour + ' : ' + minute
  }

  const onChangeSelectMember = (e) => {
    console.log(e.target.value)
    
  }

  const getPair = ({id, pair, startTime, endTime}) => {
    console.log(id)
    if (!members) return
    const filterArray = members.filter(member => {
      const memberStartTime = new Date(date[0], date[1] - 1, date[2], member.startHour, member.startMinute).getTime()
      const memberEndTime = new Date(date[0], date[1] - 1, date[2], member.endHour, member.endMinute).getTime()
      if (startTime >= memberStartTime && endTime <= memberEndTime) return member
    })

    const options = filterArray.map(member => ({
      key: member.name,
      value: member.name
    }))

    return (
      <>
        <Select name="selectPairA-1" options={options} />
        <Select name="selectPairA-2" options={options} />
      </>
    )
  }

  const onChangeScore = () => {
    console.log('score')
  }

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
        <tbody>
          {games && games.map((game, idx) => {
            return (
            <tr key={game.id}>
              <td>{idx + 1}</td>
              <td>{game.number}</td>
              <td>{getHourMinute(game.startTime)}</td>
              <td>{getPair(game)}</td>
              <td>{getPair(game)}</td>
              <td>{getScore(game.score)}</td>
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
