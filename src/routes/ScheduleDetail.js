import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import { ref, set, onValue, remove } from 'firebase/database'
import { useRouteMatch } from 'react-router-dom'

const ScheduleDetail = () => {
  const match = useRouteMatch()
  const key = match.params.name.trim()
  const [init, setInit] = useState(false)
  const [schedule, setSchedule] = useState()
  const [members, setMembers] = useState()
  const scheduleRef = ref(db, '/reactTennis/schedule/' + match.params.name)

  useEffect(() => {
    
    const membersRef = ref(db, 'reactTennis/members')
    onValue(scheduleRef, (snapshot) => {
      console.log(snapshot.val())
      setSchedule(snapshot.val())
    })
    console.log(schedule)
    setInit(true)
    // onValue(membersRef, snapshot => {
    //   const newArray = []
    //   snapshot.forEach(child => {
    //     newArray.push(child.val().name)
    //   })
    //   setMembers(newArray.filter(member => {
    //     return !schedule.checkMembers.find(val => val === member)
    //   }))
    // })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClickDelete = (idx) => {
    const deleteRef = ref(
      db,
      'reactTennis/schedlue/' + key + '/members' + [idx]
    )
    onValue(deleteRef, (snapshot) => {
      console.log(snapshot.val())
    })
  }
  return (
    <>
      {init ? (
        <div></div>
      ) : (
        '!Initialize!!!'
      )}
    </>
  )
}

export default ScheduleDetail
