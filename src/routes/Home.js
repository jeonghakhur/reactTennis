import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase'
import { ref, push, set, onValue } from 'firebase/database'
import Members from '../components/Members'
import GamesRanking from '../components/gamesRanking'
import _ from 'lodash'

const DOC_GAME = 'reactTennis/games'

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
      <div>
        <GamesRanking members={members} />
      </div>
      {/* <form onSubmit={onSubmit}>
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
        <input type="submit" value="submit" />
      </form> */}
      {/* {members.map(member => (
        <Members key={member.id} member={member} />
      ))} */}
    </>
  )
}

export default Home
