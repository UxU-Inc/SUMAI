import React, { Component } from 'react'; 

// import Header from "../components/Header"; 
import Signup from "../components/Signup";
import Login from "../components/Login";
import { Alert, AlertTitle } from '@material-ui/lab';

import { connect } from 'react-redux';
import { loginRequest, snsloginRequest } from '../actions/authentication';

import axios from 'axios'

class LoginMain extends Component{ 
    handleChckSignupEmail = (email) => {
        return axios.post('/api/account/checkSignupEmail', {email}).then((res) => {
            return { success: true }
        }).catch((err) => {
            return { success: false}
        })
    }

    handleLogin = (email, password) => {
        return this.props.loginRequest(email, password).then(
            () => {
                if(this.props.login.status === "SUCCESS") {
                    let domainIndex = window.location.hostname.indexOf('.') // ex) asdf.good.com -> 5 (.의 위치)
                    let domainName
                    if(domainIndex === -1) domainName = window.location.hostname // .을 못 찾은 경우 그대로 씀 -> localhost
                    else domainName = window.location.hostname.substr(domainIndex) // .이 있는 경우 -> .good.com
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        email: email
                    };
 
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData)) + ';domain=' + domainName + ';path=/;';
 
                    if(navigator.cookieEnabled) {  // 쿠키 허용 상태
                        this.props.history.push('/');
                    } else {  // 쿠키 차단 상태
                        return { success: true, error: 92 }
                    }

                    return { success: true };
                } else {
                    return { success: false, error: this.props.login.error }
                }
            }
        );
    }
    handleSNSLogin = (type) => {
        return this.props.snsloginRequest(type).then(
            (email) => {
                if(this.props.login.status === "SUCCESS") {
                    let domainIndex = window.location.hostname.indexOf('.') // ex) asdf.good.com -> 5 (.의 위치)
                    let domainName
                    if(domainIndex === -1) domainName = window.location.hostname // .을 못 찾은 경우 그대로 씀 -> localhost
                    else domainName = window.location.hostname.substr(domainIndex) // .이 있는 경우 -> .good.com
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        email: email
                    };
 
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData)) + ';domain=' + domainName + ';path=/;';
 
                    if(navigator.cookieEnabled) {  // 쿠키 허용 상태
                        this.props.history.push('/');
                    } else {  // 쿠키 차단 상태
                        return { success: true, error: 92 }
                    }
                    
                    return { success: true };
                } else {
                    return { success: false, error: this.props.login.error }
                }
            }
        );
    }
    render(){ 
        return ( 
            <div> 
                {/* <Header props={this.props}/>  */}
                {this.props.signup.status === "SUCCESS"? 
                    <Alert severity="success">
                        <AlertTitle>SUMAI 회원가입 완료!</AlertTitle>
                        <strong>로그인을 해주세요!</strong>
                    </Alert>: null}
                <div style={{backgroundColor: "#fff"}}>
                    {this.props.match.path === "/login/signup"? 
                        <Signup onCheckSignupEmail={this.handleChckSignupEmail} onLogin={this.handleLogin}/>:
                        <Login onLogin={this.handleLogin} onSNSLogin={this.handleSNSLogin} loginStatus={this.props.login.status}/>
                    }
                </div>
            </div> 
        ) 
    } 
}

const mapStateToProps = (state) => {
    return {
        login: state.authentication.login,
        signup: state.authentication.signup,
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (email, password) => {
            return dispatch(loginRequest(email, password));
        },
        snsloginRequest: (type) => {
            return dispatch(snsloginRequest(type));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginMain);