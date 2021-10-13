import React, { useState } from 'react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'

const Auth = () => {
  const auth = getAuth()
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  })
  const [newAccount, setNewAccount] = useState(false)

  const { email, password } = inputs

  const onChange = (event) => {
    const { name, value } = event.target
    setInputs({
      ...inputs,
      [name]: value,
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    if (!newAccount) {
      signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          console.log(userCredential, 'login seccess')
        })
        .catch(error => {
          alert('사용자 정보가 일치하지 않습니다.')
        })
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          console.log(userCredential.user, 'create seccess')
        })
        .catch(error => {
          console.log(error.code, error.message)
        })
    }
  }

  const toggleAccount = (value) => {
    setNewAccount(value)
  }
  return (
    <div>
      <div className="sign-wrap">
        <button type="button" onClick={() => {
          toggleAccount(true)
        }} className={newAccount ? 'isChecked' : ''}>Create Account</button>
        <button type="button"  onClick={() => {
          toggleAccount(false)
        }} className={!newAccount ? 'isChecked' : ''}>Sign</button>
      </div>
      <form onSubmit={onSubmit}>
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={onChange}
            value={email}
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={onChange}
            value={password}
          />
        </div>
        <div>
          <input type="submit"
          value={!newAccount ? 'Login' : 'Create Account'} />
        </div>
        
      </form>
      <div>
        <button type="button">Google Log in</button>

      </div>
    </div>
  )
}

export default Auth
