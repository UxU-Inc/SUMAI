import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

import Main from "./Main";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Notices from "./components/Notices";
import LoginMain from "./components/LoginMain";

class App extends Component { 
  render() { 
    return ( 
      <Router> 
          <div> 
            <Route exact path="/" component={ Main } /> 
              
            <Route path="/terms" component={ Terms } />
            <Route path="/privacy" component={ Privacy } />
            <Route path="/notices" component={ Notices } />

            <Route path="/login" component={ LoginMain } />
          </div> 
      </Router> 
      ); 
  } 
}

export default App;
