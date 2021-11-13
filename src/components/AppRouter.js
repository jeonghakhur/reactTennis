import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Home from '../routes/Home'
import Auth from '../routes/Auth'
import Profile from '../routes/Profile'
import Schedule from '../routes/Schedule'
import ScheduleDetail from '../routes/ScheduleDetail'
import Game from '../routes/Game'
import GameDetail from '../routes/GameDetail'

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} userObj={userObj} />
      <Switch>
        <Route exact path="/">
          <Home userObj={userObj} />
        </Route>
        <Route exact path="/auth">
          <Auth />
        </Route>
        <Route path="/schedule/:name">
          <ScheduleDetail />
        </Route>
        <Route path="/schedule">
          <Schedule />
        </Route>
        <Route path="/games/:name">
          <GameDetail userObj={userObj}/>
        </Route>
        <Route past="/games" >
          <Game userObj={userObj} />
        </Route>

        <Route path="/profile">
          <Profile />
        </Route>
      </Switch>
    </Router>
  )
}

export default AppRouter
