//액션생성자 함수와 thunk 를 정의하는 파일입니다.
import axios from 'axios';
import * as types from './ActionTypes';
 
/* SIGNUP */
export function signupRequest(email, name, password) {
    return (dispatch) => {
        // Inform signup API is starting
        dispatch(signup());
 
        return axios.post('/api/account/signup', { email, name, password })
        .then((response) => {
            dispatch(signupSuccess());
        }).catch((error) => {
            dispatch(signupFailure(error.response.data.code || -1));
        });
    };
}
 
export function signup() {
    return {
        type: types.AUTH_SIGNUP
    };
}
 
export function signupSuccess() {
    return {
        type: types.AUTH_SIGNUP_SUCCESS,
    };
}
 
export function signupFailure(error) {
    return {
        type: types.AUTH_SIGNUP_FAILURE,
        error: error
    };
}

/* LOGIN */
export function loginRequest(email, password) {
    return (dispatch) => {
        // Inform Login API is starting
        dispatch(login());
   
        // API REQUEST
        return axios.post('/api/account/login', { email, password })
        .then((response) => {
            // SUCCEED
            dispatch(loginSuccess(response.data.id, response.data.email, response.data.name));
        }).catch((error) => {
            // FAILED
            dispatch(loginFailure(error.response.data.code || -1));
        });
    };
}

export function snsloginRequest(type) {
    return (dispatch) => {
        // Inform Login API is starting
        dispatch(login());
   
        // API REQUEST
        var a= window.open('api/snslogin/'+ type, type + "LOGIN", "width=500,height=700")
        console.log(a)
        return new Promise(async (resolve, reject) => {
            const Interval = setInterval(() => {
                if(a.closed) {
                    axios.get('/api/snslogin/confirm')
                    .then((response) => {
                        console.log(response)
                        // SUCCEED
                        dispatch(loginSuccess(response.data.id, response.data.email, response.data.name))
                        resolve(response.data.email)
                    }).catch((error) => {
                        // FAILED
                        console.log(error.response.data || -1)
                        dispatch(loginFailure(error.response.data || -1));
                        resolve()
                    });
                    clearInterval(Interval)
                }
            }, 100);
        })
    };
}
   
export function login() {
    return {
        type: types.AUTH_LOGIN
    };
}
   
export function loginSuccess(id, email, name) {
    return {
        type: types.AUTH_LOGIN_SUCCESS,
        id: id,
        email: email,
        name: name,
    };
}

export function loginFailure(error) {
    return {
        type: types.AUTH_LOGIN_FAILURE,
        error: error
    };
}

export function getStatusRequest() {
    return (dispatch) => {
        // inform Get Status API is starting
        dispatch(getStatus());
        return axios.get('/api/account/getinfo')
        .then((response) => {
            console.log(response.data)
            dispatch(getStatusSuccess(response.data.info.id, response.data.info.email, response.data.info.name)); //HTTP 통신을 통해 name 받아옴
        }).catch((error) => {
            dispatch(getStatusFailure());
        });
    };
}
 
export function getStatus() {
    return {
        type: types.AUTH_GET_STATUS
    };
}
 
export function getStatusSuccess(id, email, name) {
    return {
        type: types.AUTH_GET_STATUS_SUCCESS,
        id: id,
        email: email,
        name: name,
    };
}
 
export function getStatusFailure() {
    return {
        type: types.AUTH_GET_STATUS_FAILURE
    };
}

/* Logout */
export function logoutRequest() {
    return (dispatch) => {
        return axios.post('/api/account/logout')
        .then((response) => {
            dispatch(logout());
        });
    };
}
 
export function logout() {
    return {
        type: types.AUTH_LOGOUT
    };
}

/* nameChange */
export function nameChangeRequest(email, name) {
    return (dispatch) => {
        // Inform nameChange API is starting
        dispatch(nameChange());
 
        return axios.post('/api/account/nameChange', { email, name })
        .then((response) => {
            dispatch(nameChangeSuccess(email, name));
        }).catch((error) => {
            dispatch(nameChangeFailure(error.response.data.code || -1));
        });
    };
}

export function nameChange() {
    return {
        type: types.NAME_CHANGE
    };
}
 
export function nameChangeSuccess(email, name) {
    return {
        type: types.NAME_CHANGE_SUCCESS,
        email: email,
        name: name,
    };
}
 
export function nameChangeFailure(error) {
    return {
        type: types.NAME_CHANGE_FAILURE,
        error: error
    };
}