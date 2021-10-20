import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { ref, push, set, onValue } from 'firebase/database'
import Members from '../components/Members'

const Home = ({ userObj }) => {
  const [inputs, setInputs] = useState({
    name: '',
    gender: '',
  })

  const [members, setMembers] = useState([])

  const membersListRef = ref(db, 'reactTennis/members')

  const getMemberList = () => {
    onValue(membersListRef, snapshot => {
      const newArray = []
      snapshot.forEach(child => {
        newArray.push({
          id: child.key,
          ...child.val()
        })
      })

      setMembers(newArray)
    })
  }

  useEffect(() => {
    getMemberList()
  }, [])

  // const [day, setDay] = useState([])

  const { name, gender } = inputs
  const hadleInputChange = (e) => {
    const { name, value } = e.target
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  function writeUserData() {
    const newMembersListRef = push(membersListRef)
    set(newMembersListRef, {
      name,
      gender
    })
  }

  const handleUpdateClick = () => {
    const userId = userObj.uid
    set(ref(db, 'reactTennis/members/' + userId), {
      uid: userId,
      name: '정학'
    });
  }

  const onSubmit = (e) => {
    e.preventDefault()
    writeUserData()
  }


  const handleGenderClick = e => {
    const { value } = e.target
    setInputs({
      ...inputs,
      gender: value
    })
  }

  // const handleDayClick = e => {
  //   const {checked, value } = e.target
  //   if (checked) {
  //     setDay(pre => [...pre, value])
  //   } else {
  //     setDay(day.filter(val => val !== value))
  //   }
  // }
  return (
    <>
      <h2>Home</h2>
      <form onSubmit={onSubmit}>
        <div>
          <span>이름</span>
          <input
            name="name"
            value={name}
            onChange={hadleInputChange}
            type="text"
          />
        </div>
        <div>
          <span>성별</span>
          <label>남성<input type="radio" onClick={handleGenderClick} name="gender" value="M" /></label>
          <label>여성<input type="radio" onClick={handleGenderClick} name="gender" value="F" /></label>
        </div>
        {/* <div>
          <span>참석요일</span>
          <label>월<input type="checkbox" onClick={handleDayClick} name="day-mo" value="Mo" /></label>
          <label>화<input type="checkbox" onClick={handleDayClick} name="day-tu" value="Tu" /></label>
          <label>수<input type="checkbox" onClick={handleDayClick} name="day-we" value="We" /></label>
          <label>목<input type="checkbox" onClick={handleDayClick} name="day-th" value="Th" /></label>
          <label>금<input type="checkbox" onClick={handleDayClick} name="day-fr" value="Fr" /></label>
          <label>토<input type="checkbox" onClick={handleDayClick} name="day-sa" value="Sa" /></label>
          <label>일<input type="checkbox" onClick={handleDayClick} name="day-su" value="Su" /></label>
        </div> */}
        {/* <div>
          <span>레벨</span>
          <input type="number" name="range" onChange={hadleInputChange} value={range} />
        </div> */}
        <input type="submit" value="submit" />
        <button type="button" onClick={handleUpdateClick}>update</button>
      </form>
      {members.map(member => (
        <Members member={member} />
      ))}
    </>
  )
}

export default Home
