import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Home from '../routes/Home'
import Auth from '../routes/Auth'
import Profile from '../routes/Profile'
import Schedule from '../routes/Schedule'
import ScheduleDetail from '../routes/ScheduleDetail'

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} userObj={userObj} />
      <Switch>
      <Route path="/schedule/:name">
          <ScheduleDetail />
        </Route>
        <Route path="/schedule">
          <Schedule />
        </Route> 

        <Route exact path="/auth">
          <Auth />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route exact path="/">
          <Home userObj={userObj} />
        </Route>
      </Switch>
    </Router>
  )
}

export default AppRouter
