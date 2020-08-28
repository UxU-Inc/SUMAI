import React, { Component } from 'react'; 

// import Header from "../components/Header"; 
import Signup from "../components/Signup";
import Login from "../components/Login";
import { Alert, AlertTitle } from '@material-ui/lab';

import { connect } from 'react-redux';
import { signupRequest, loginRequest, snsloginRequest } from '../actions/authentication';

class LoginMain extends Component{ 
    handleSignup = (email, name, password) => {
        return this.props.signupRequest(email, name, password).then(
            () => {
                if(this.props.signup.status === "SUCCESS") {
                    this.props.history.push('/login');
                    return { success: true }
                } else {
                    return { success: false, error: this.props.signup.error }
                }
            }
        );
    }
    handleLogin = (email, password) => {
        return this.props.loginRequest(email, password).then(
            () => {
                if(this.props.login.status === "SUCCESS") {
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        email: email
                    };
 
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
 
                    this.props.history.push('/');
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
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        email: email
                    };
 
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
 
                    this.props.history.push('/');
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
                    {this.props.match.path === "/login/signup"? <Signup onSignup={this.handleSignup}/>:<Login onLogin={this.handleLogin} onSNSLogin={this.handleSNSLogin}/>}
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
        signupRequest: (email, name, password) => {
            return dispatch(signupRequest(email, name, password));
        },
        snsloginRequest: (type) => {
            return dispatch(snsloginRequest(type));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginMain);