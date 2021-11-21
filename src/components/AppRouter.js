import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Home from '../routes/Home'
import TotalGame from '../routes/TotalGame'

import Auth from '../routes/Auth'
// import Profile from '../routes/Profile'
import Schedule from '../routes/Schedule'
import ScheduleDetail from '../routes/ScheduleDetail'
import Game from '../routes/Game'
import GameDetail from '../routes/GameDetail'

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} userObj={userObj} />
      <Switch>
        <Route
          path="/games/:name"
          render={() => <GameDetail userObj={userObj} />}
        />
        <Route path="/games" render={() => <Game userObj={userObj} />} />
        <Route path="/schedule/:name" component={ScheduleDetail} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/totalGame/:name" component={TotalGame} />
        <Route path="/totalGame" component={TotalGame} />
        <Route path="/auth" component={Auth} />
        <Route exact path="/" component={Home} userObj={userObj} />
        {/* <Route path="/profile">
          <Profile />
        </Route> */}
      </Switch>
    </Router>
  )
}

export default AppRouter
