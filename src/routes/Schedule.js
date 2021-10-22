import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import {
  ref,
  push,
  onValue,
  set,
  remove,
  query,
  orderByChild,
} from 'firebase/database'

const Schedule = () => {
  const nowDate = new Date()
  let nowMonth = String(nowDate.getMonth() + 1)
  nowMonth = nowMonth.length < 2 ? '0' + nowMonth : nowMonth
  const [date, setDate] = useState(`${nowDate.getFullYear()}-${nowMonth}`)
  const [schedules, setSchedules] = useState([])
  const [members, setMembers] = useState([])
  const [day, setDay] = useState('월')
  const [checkMembers, setCheckMembers] = useState([])

  useEffect(() => {
    const scheduleRef = 
      ref(db, 'reactTennis/schedule')
    const membersRef = query(
      ref(db, 'reactTennis/members'),
      orderByChild('name')
    )

    onValue(scheduleRef, (snapshot) => {
      const newArray = []
      snapshot.forEach((child) => {
        newArray.push({
          id: child.key,
          ...child.val(),
        })
      })

      newArray.sort((a, b) => {
        if (a.date > b.date) {
          return -1
        }
        if (a.date < b.date) {
          return 1
        }
        return 0
      })
      setSchedules(newArray)
    })

    onValue(membersRef, (snapshot) => {
      const newArray = []
      snapshot.forEach((child) => {
        newArray.push({
          id: child.key,
          ...child.val(),
        })
      })
      setMembers(newArray)
    })
    // console.log(schedules[0].member)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangeMonth = (e) => {
    const { value } = e.target
    setDate(value)
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()

    if (!date) {
      alert('날짜가 선택되지 않았습니다.')
      return
    }
    if (!day) {
      alert('요일이 선택되지 않았습니다.')
      return
    }
    if (checkMembers.length === 0) {
      alert('멤버가 선택되지 않았습니다.')
      return
    }
    console.log('day', day, checkMembers)
    const scheduleRef = ref(db, 'reactTennis/schedule')
    const newRef = push(scheduleRef)
    set(newRef, {
      date,
      day,
      members: checkMembers.map((member) => {
        const obj = {
          name: member,
          account: 'N',
        }
        return obj
      }),
    })
  }

  const handleClickDelete = (id) => {
    const confirm = window.confirm('정말로 삭제하시겠습니까?')
    if (confirm) {
      remove(ref(db, 'reactTennis/schedule/' + id))
        .then(() => {
          console.log('remove seccss')
        })
        .catch((error) => {
          console.log('remove error', error)
        })
    }
  }

  const handleChangeDay = (e) => {
    const { value } = e.target
    setDay(value)
  }

  const handleClickMembers = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setCheckMembers((pre) => [...pre, value])
    } else {
      setCheckMembers(checkMembers.filter((val) => val !== value))
    }
  }

  const handleClickCheckToggle = (e) => {
    const { target } = e
    const className = target.getAttribute('class')
    const checkEls = document.querySelectorAll('[name="memberName"]')
    if (className) {
      target.classList.remove('is-all-checked')
      checkEls.forEach((el) => (el.checked = false))
      target.textContent = '전체 멤버 선택'
      setCheckMembers([])
    } else {
      target.classList.add('is-all-checked')
      const newArray = []
      checkEls.forEach((el) => {
        el.checked = true
        newArray.push(el.value)
      })
      target.textContent = '전체 멤버 해제'
      setCheckMembers(newArray)
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleOnSubmit}>
          <input
            type="month"
            onChange={handleChangeMonth}
            name="date"
            value={date}
          />
          <select onChange={handleChangeDay} value={day}>
            <option value="월">월요일</option>
            <option value="수">수요일</option>
            <option value="목">목요일</option>
            <option value="금">금요일</option>
            <option value="토">일요일</option>
          </select>
          <button type="button" onClick={handleClickCheckToggle}>
            전체 멤버 선택
          </button>
          <div>
            {members.map((member) => (
              <label key={member.id}>
                <input
                  type="checkbox"
                  name="memberName"
                  value={member.name}
                  onClick={handleClickMembers}
                />
                {member.name}
              </label>
            ))}
          </div>
          <input type="submit" value="submit" />
        </form>
      </div>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>번호</th>
              <th>날자</th>
              <th>요일</th>
              <th>참석자</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((data, idx) => (
              <tr key={data.id}>
                <td>{schedules.length - idx}</td>
                <td>
                  <Link to={`/schedule/${data.id}`}>{data.date}</Link>
                </td>
                <td>{data.day}</td>
                <td>{data.members.length}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      handleClickDelete(data.id)
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Schedule
