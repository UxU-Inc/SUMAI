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
import AccountPassword from "./components/AccountPassword";

import { connect } from 'react-redux';
import { getStatusRequest } from './actions/authentication';

class App extends Component { 
  componentDidMount() { //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
    // get cookie by name
    function getCookie(name) {
        var value = "; " + document.cookie; 
        var parts = value.split("; " + name + "="); 
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // get loginData from cookie
    let loginData = getCookie('key');
    // if loginData is undefined, do nothing
    if(typeof loginData === "undefined") return;

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));

    // if not logged in, do nothing
    if(!loginData.isLoggedIn) return;
    console.log(loginData);

    // page refreshed & has a session in cookie,
    // check whether this cookie is valid or not
    this.props.getStatusRequest().then(
        () => {
            console.log(this.props.status)
            console.log(this.props.state)
            // if session is not valid
            if(!this.props.status.valid) {
                // logout the session
                loginData = {
                    isLoggedIn: false,
                    email: ''
                };

                document.cookie='key=' + btoa(JSON.stringify(loginData));
            }
        }
    );
}
  render() { 
    return ( 
      <Router> 
          <div> 
            <Route exact path="/" component={ Main } /> 
              
            <Switch>
              <Route path="/accounts/name" component={ AccountNameChange } />
              <Route path="/accounts/password" component={ AccountPassword } />
              <Route path="/accounts" component={ Account } />
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

const mapStateToProps = (state) => {
  return {
      status: state.authentication.status,
      state: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      getStatusRequest: () => {
          return dispatch(getStatusRequest());
      },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
