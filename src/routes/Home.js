import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase'
import { ref, push, set, onValue } from 'firebase/database'
import Members from '../components/Members'

const Home = ({ userObj }) => {
  const [inputs, setInputs] = useState({
    name: '',
    gender: 'M',
  })

  const inputRef = useRef()

  const [members, setMembers] = useState([])

  const membersListRef = ref(db, 'reactTennis/members')

  useEffect(() => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const onSubmit = e => {
    e.preventDefault()
    writeUserData()
    setInputs({
      ...inputs,
      name: ''
    })
    
    inputRef.current.focus()
  }


  const handleGenderClick = e => {
    const { value } = e.target
    
    setInputs({
      ...inputs,
      gender: value
    })

    console.log(gender)
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
      <div>
        <section>
          <h2>최근 게임 결과</h2>
        </section>
        <section>
          <h2>순위</h2>
        </section>
        {userObj && (
        <section>
          <h2>나의 최근 게임 내역</h2>
        </section>
        )}
      </div>
      <form onSubmit={onSubmit}>
        <div>
          <span>이름</span>
          <input
            ref={inputRef}
            name="name"
            value={name}
            onChange={hadleInputChange}
            type="text"
          />
        </div>
        <div>
          <span>성별</span>
          <label>남성<input type="radio" onClick={handleGenderClick} name="gender" value="M" defaultChecked /></label>
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
      </form>
      {members.map(member => (
        <Members key={member.id} member={member} />
      ))}
    </>
  )
}

export default Home
