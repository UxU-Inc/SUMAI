import React, { Component } from 'react'; 

import Header from "../components/Header"; 
import Signup from "../components/Signup";
import Login from "../components/Login";
import { Alert, AlertTitle } from '@material-ui/lab';

import { connect } from 'react-redux';
import { signupRequest, loginRequest  } from '../actions/authentication';

class LoginMain extends Component{ 
    handleSignup = (email, name, password) => {
        return this.props.signupRequest(email, name, password).then(
            () => {
                if(this.props.signupStatus === "SUCCESS") {
                    this.props.history.push('/login');
                    return { success: true }
                } else {
                    return { success: false, error: this.props.signupErrorCode }
                }
            }
        );
    }
    handleLogin = (email, password) => {
        return this.props.loginRequest(email, password).then(
            () => {
                if(this.props.loginStatus === "SUCCESS") {
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        email: email
                    };
 
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
 
                    this.props.history.push('/');
                    return { success: true };
                } else {
                    return { success: false, error: this.props.loginErrorCode }
                }
            }
        );
    }
    render(){ 
        return ( 
            <div> 
                <Header props={this.props}/> 
                {this.props.signupStatus === "SUCCESS"? 
                    <Alert severity="success">
                        <AlertTitle>SUMAI 회원가입 완료!</AlertTitle>
                        <strong>로그인을 해주세요!</strong>
                    </Alert>: null}
                <div className="Main">
                    {this.props.match.path === "/login/signup"? <Signup onSignup={this.handleSignup}/>:<Login onLogin={this.handleLogin}/>}
                </div>
            </div> 
        ) 
    } 
}

const mapStateToProps = (state) => {
    return {
        loginStatus: state.authentication.login.status,
        loginErrorCode: state.authentication.login.error,
        signupStatus: state.authentication.signup.status,
        signupErrorCode: state.authentication.signup.error
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (email, password) => {
            return dispatch(loginRequest(email, password));
        },
        signupRequest: (email, name, password) => {
            return dispatch(signupRequest(email, name, password));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginMain);