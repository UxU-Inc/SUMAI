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
import AccountWithdrawal from "./components/AccountWithdrawal";
import AccountBirthday from "./components/AccountBirthday";
import AccountGender from "./components/AccountGender";
import EmailCertification from "./components/EmailCertification"

import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from './actions/authentication';
import { ClientInfoComponent } from './reducers/clientInfo';

class App extends Component { 
  componentDidMount() { //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인

    // 쿠키 차단 설정 시 자동 로그아웃
    if(!navigator.cookieEnabled && this.props.status.isLoggedIn) {
      this.props.history.push("/")
      this.props.logoutRequest().then(
          () => {
              // EMPTIES THE SESSION
              let loginData = {
                  isLoggedIn: false,
                  email: ''
              };
              document.cookie = 'key=' + btoa(JSON.stringify(loginData));
          }
      );
    }

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

    // page refreshed & has a session in cookie,
    // check whether this cookie is valid or not
    this.props.getStatusRequest().then(
        () => {
            console.log(this.props.status)
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
        <ClientInfoComponent /> 
          <div> 
            <Route exact path="/" component={ Main } /> 
              
            <Switch>
              <Route exact path="/accounts" component={ Account } />
              <Route path="/accounts/name" component={ AccountNameChange } />
              <Route path="/accounts/password" component={ AccountPassword } />
              <Route path="/accounts/withdrawal" component={ AccountWithdrawal } />
              <Route path="/accounts/birthday" component={ AccountBirthday } />
              <Route path="/accounts/gender" component={ AccountGender } />
            </Switch>

            <Route path="/terms" component={ Terms } />
            <Route path="/privacy" component={ Privacy } />
            <Route path="/notices" component={ Notices } />
            <Route path="/EmailCertification" component={ EmailCertification } />

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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      getStatusRequest: () => {
          return dispatch(getStatusRequest());
      },
      logoutRequest: () => {
        return dispatch(logoutRequest());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
