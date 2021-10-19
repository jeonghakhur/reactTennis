import React, { useState } from 'react'
import { database } from '../firebase'

const Home = ({ userObj }) => {
  const [inputs, setInputs] = useState({
    memberName: '',
  })

  const { memberName } = inputs
  const hadleInputChange = (e) => {
    const { name, value } = e.target
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log('submit')
  }

  return (
    <>
      <h2>Home</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            name="memberName"
            value={memberName}
            onChange={hadleInputChange}
            type="text"
          />
        </div>
        <input type="submit" value="submit" />
      </form>
    </>
  )
}

export default Home
