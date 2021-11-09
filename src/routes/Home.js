import React, { useEffect, useState, useRef } from 'react'
import { db } from '../firebase'
import { ref, push, set, onValue } from 'firebase/database'
import Members from '../components/Members'
import _ from 'lodash'
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react'

const DOC_GAME = 'reactTennis/games'

const Home = ({ userObj }) => {
  const [inputs, setInputs] = useState({
    name: '',
    gender: 'M',
  })

  const inputRef = useRef()

  const [members, setMembers] = useState([])
  const [games, setGames] = useState([])

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
    
    onValue(ref(db, DOC_GAME), snapshot => {
      const newArray = []
      snapshot.forEach(child => {
        newArray.push({
          id: child.key,
          ...child.val()
        })
      })
      console.log(newArray)

      const gameArray = []
      newArray.forEach(data => {
        data.games.forEach(games => {
          if (games.player[0] !== '') {
            gameArray.push(games)
          }
        })
      })
      console.log(gameArray)

      const gameMemberArray = []
      gameArray.forEach(game => {
        game.player.forEach(member => {
          if (gameMemberArray.indexOf(member) === -1) {
            gameMemberArray.push(member)
          }
        })
      })

      const userGame = gameMemberArray.map(gameMember => {
        const obj = {}
        obj.name = gameMember
        obj.game = gameArray.filter(game => game.player.indexOf(gameMember) !== -1)
        return obj
      })


      const newGame = []
      userGame.forEach(user => {
        let pointTotal = 0
        let pointWin = 0
        let pointLose = 0
        let countWin = 0
        let countLose = 0
        let countTie = 0

        user.game.forEach(game => {
          const index = game.player.indexOf(user.name)
          let myScore = 0
          let yourScore = 0

          if (index < 2) {
            myScore = game.score[0]
            yourScore = game.score[1]
          } else {
            myScore = game.score[1]
            yourScore = game.score[0]
          }

          if (myScore > yourScore) {
            pointTotal += 3
            countWin += 1
          } else if (myScore === yourScore) {
            pointTotal += 1
            countTie += 1
          } else {
            pointTotal += 0
            countLose += 1
          }

          pointWin += Number(myScore)
          pointLose += Number(yourScore)
        })
        
        newGame.push({
          name: user.name, 
          countTotal: user.game.length,
          countWin,
          countLose,
          countTie,
          pointTotal,
          pointWin,
          pointLose,
        })
      })

      console.log(newGame)


      setGames(newArray)
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
