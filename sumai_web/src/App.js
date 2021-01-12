import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

import Main from "./Main";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Notices from "./components/Notices";
import LoginMain from "./components/LoginMain";
import PasswordReset from './components/PasswordReset';
import Account from "./components/Account";
import AccountNameChange from "./components/AccountNameChange";
import AccountPassword from "./components/AccountPassword";
import AccountWithdrawal from "./components/AccountWithdrawal";
import AccountBirthday from "./components/AccountBirthday";
import AccountGender from "./components/AccountGender";
import EmailCertification from "./components/EmailCertification"
import EmailLogin from "./components/EmailLogin"
import Test from "./components/popup"
import NotFound from "./components/NotFound"

import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest, getStatusFailure } from './actions/authentication';
import { ClientInfoComponent } from './reducers/clientInfo';

class App extends Component { 
  componentDidMount() { //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
    let domainIndex = window.location.hostname.indexOf('.') // ex) asdf.good.com -> 5 (.의 위치)
    let domainName
    if(domainIndex === -1) domainName = window.location.hostname // .을 못 찾은 경우 그대로 씀
    else domainName = window.location.hostname.substr(domainIndex) // .이 있는 경우 -> .good.com

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
              document.cookie = 'key=' + btoa(JSON.stringify(loginData)) + ';domain=' + domainName + ';path=/;';
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
    if(typeof loginData === "undefined") {
      this.props.getStatusFailure()
      return
    };

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));

    // if not logged in, do nothing
    if(!loginData.isLoggedIn) {
      this.props.getStatusFailure()
      return
    };

    // page refreshed & has a session in cookie,
    // check whether this cookie is valid or not
    this.props.getStatusRequest().then(
        () => {
            // if session is not valid
            if(!this.props.status.valid) {
                // logout the session
                loginData = {
                    isLoggedIn: false,
                    email: ''
                };

                document.cookie='key=' + btoa(JSON.stringify(loginData)) + ';domain=' + domainName + ';path=/;';
            }
        }
    );
}
  render() { 
    return ( 
      <Router>
        <ClientInfoComponent /> 
          <Switch> 
            <Route exact path="/" component={ Main } /> 
              
            <Route exact path="/accounts" component={ Account } />
            <Route path="/accounts/name" component={ AccountNameChange } />
            <Route path="/accounts/password" component={ AccountPassword } />
            <Route path="/accounts/withdrawal" component={ AccountWithdrawal } />
            <Route path="/accounts/birthday" component={ AccountBirthday } />
            <Route path="/accounts/gender" component={ AccountGender } />
            

            <Route path="/terms" component={ Terms } />
            <Route path="/test" component={ Test } />
            <Route path="/privacy" component={ Privacy } />
            <Route path="/notices" component={ Notices } />
            <Route path="/email/certification" component={ EmailCertification } />
            <Route path="/email/login" component={ EmailLogin } />


            <Route exact path="/login" component={ LoginMain } />
            <Route path="/login/signup" component={ LoginMain } />
            <Route path="/login/password/reset" component={ PasswordReset } />
            
            <Route component={ NotFound } status={404}/>
          </Switch> 
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
      getStatusFailure: () => {
        return dispatch(getStatusFailure());
      },
      getStatusRequest: () => {
          return dispatch(getStatusRequest());
      },
      logoutRequest: () => {
        return dispatch(logoutRequest());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
