import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, Button } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditFitness } from './components/EditFitness'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { FitnessC } from './components/Fitness'
import { CreateFitness } from './components/CreateFitness'
import { MyFitness } from './components/MyFitness'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleMyFitness() {
    this.props.history.push(`/fitness/me`)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item name="myFitness">
          <Link to="/fitness/me">My Fitness</Link>
        </Menu.Item>
      
        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return <FitnessC {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/fitness/create"
          exact
          render={(props) => {
            return <CreateFitness {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/fitness/me"
          exact
          render={(props) => {
            return <MyFitness {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/fitness/:fitnessId/edit"
          exact
          render={(props) => {
            return <EditFitness {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
