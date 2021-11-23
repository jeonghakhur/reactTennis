import React from 'react'
import { useHistory } from 'react-router-dom'
import { auth } from '../firebase'
import {
  // createUserWithEmailAndPassword,
  // signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'

const Auth = () => {
  const history = useHistory()
  // const [inputs, setInputs] = useState({
  //   email: '',
  //   password: '',
  // })
  // const [newAccount, setNewAccount] = useState(false)

  // const { email, password } = inputs

  // const onChange = (event) => {
  //   const { name, value } = event.target
  //   setInputs({
  //     ...inputs,
  //     [name]: value,
  //   })
  // }

  // const onSubmit = (event) => {
  //   event.preventDefault()
  //   if (!newAccount) {
  //     signInWithEmailAndPassword(auth, email, password)
  //       .then((userCredential) => {
  //         console.log(userCredential, 'login seccess')
  //         history.push('/')
  //       })
  //       .catch((error) => {
  //         alert('사용자 정보가 일치하지 않습니다.')
  //       })
  //   } else {
  //     createUserWithEmailAndPassword(auth, email, password)
  //       .then((userCredential) => {
  //         console.log(userCredential.user, 'create seccess')
  //         history.push('/')
  //       })
  //       .catch((error) => {
  //         console.log(error.code, error.message)
  //       })
  //   }
  // }

  // const toggleAccount = (value) => {
  //   setNewAccount(value)
  // }

  const googleProvider = new GoogleAuthProvider()

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        history.push('/')
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <div>
      {/* <div className="sign-wrap">
        <button
          type="button"
          onClick={() => {
            toggleAccount(true)
          }}
          className={newAccount ? 'isChecked' : ''}
        >
          Create Account
        </button>
        <button
          type="button"
          onClick={() => {
            toggleAccount(false)
          }}
          className={!newAccount ? 'isChecked' : ''}
        >
          Sign
        </button>
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
          <input
            type="submit"
            value={!newAccount ? 'Login' : 'Create Account'}
          />
        </div>
      </form> */}
      <div>
        <button type="button" onClick={handleGoogleLogin}>
          Google Log in
        </button>
      </div>
    </div>
  )
}

export default Auth
