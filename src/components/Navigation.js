import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'

const Navigation = ({ isLoggedIn }) => {
  const auth = getAuth()
  const history = useHistory()

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        history.push('/')
        console.log('logout')
      })
      .catch((error) => {
        console.log(`logout: ${error}`)
      })
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/schedule">참석여부</Link>
        </li>
        <li><Link to="/games">게임</Link></li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button type="button" onClick={handleLogout}>
                LogOut
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/auth">signIn</Link>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navigation
