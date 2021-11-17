import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Home from '../routes/Home'
import Auth from '../routes/Auth'
import Profile from '../routes/Profile'
import Schedule from '../routes/Schedule'
import ScheduleDetail from '../routes/ScheduleDetail'
import Game from '../routes/Game'
import GameDetail from '../routes/GameDetail'
import TotalGame from '../routes/TotalGame'

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} userObj={userObj} />
      <Switch>
        {/* <Route path="/games/:name">
          <GameDetail userObj={userObj} />
        </Route>
        <Route past="/games">
          <Game userObj={userObj} />
        </Route>
        <Route path="/schedule/:name">
          <ScheduleDetail />
        </Route>
        <Route path="/schedule">
          <Schedule />
        </Route> */}
        {/* <Route past="/totalGame" component={TotalGame} /> */}
        {/* <Route exact path="/auth">
          <Auth />
        </Route> */}
        <Route exact path="/" component={Home} userObj={userObj} />
        {/* <Route path="/profile">
          <Profile />
        </Route> */}
      </Switch>
    </Router>
  )
}

export default AppRouter
