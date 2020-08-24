import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

import Main from "./Main";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Notices from "./components/Notices";
import LoginMain from "./components/LoginMain";
import Account from "./components/Account";
import AccountNameChange from "./components/AccountNameChange";

class App extends Component { 
  render() { 
    return ( 
      <Router> 
          <div> 
            <Route exact path="/" component={ Main } /> 
              
            <Switch>
              <Route path="/account/name" component={ AccountNameChange } />
              <Route path="/account" component={ Account } />
            </Switch>

            <Route path="/terms" component={ Terms } />
            <Route path="/privacy" component={ Privacy } />
            <Route path="/notices" component={ Notices } />

            <Switch>
              <Route path="/login/signup" component={ LoginMain } />
              <Route path="/login" component={ LoginMain } />
            </Switch>
          </div> 
      </Router> 
      ); 
  } 
}

export default App;
