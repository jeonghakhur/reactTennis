import React, { useState, useEffect } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { db } from '../firebase'
import { ref, push, onValue, set } from 'firebase/database'

const Schedule = () => {
  const match = useRouteMatch()
  console.log(match)
  const [month, setMonth] = useState('')
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    const scheduleRef = ref(db, 'reactTennis/schedule')
    onValue(scheduleRef, (snapshot) => {
      const newArray = []
      snapshot.forEach((child) => {
        newArray.push({
          id: child.key,
          ...child.val(),
        })
      })
      setSchedules(newArray)
      console.log(schedules)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangeMonth = (e) => {
    const { value } = e.target
    setMonth(value)
    console.log(value)
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    const scheduleRef = ref(db, 'reactTennis/schedule')
    const newRef = push(scheduleRef)
    set(newRef, {
      date: month,
    })
  }

  return (
    <div>
      <div>
        <form onSubmit={handleOnSubmit}>
          <input
            type="month"
            onChange={handleChangeMonth}
            name="date"
            value={month}
          />
          <input type="submit" value="submit" />
        </form>
      </div>
      {schedules.map((data) => (
        <div key={data.id}>
          <Link to={`/schedule/${data.id}`}>{data.date}</Link>
        </div>
      ))}
    </div>
  )
}

export default Schedule
