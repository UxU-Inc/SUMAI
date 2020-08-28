// 리듀서는 dispatch 함수로 부터 전달받은 action 객체의 type 값에 따라 state 를 변경하는 함수입니다.
import * as types from '../actions/ActionTypes';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'

 
const initialState = {
    ipv4: '',
    href: '',
    loading: true,
    act: '',
    sendAct: false,
};
 
export default function ClientInfo(state=initialState, action) {
  switch(action.type) {
    case types.CLIENTIFO_SET:
      return {
        ...state,
        ipv4: action.ipv4,
        href: action.href,
        loading: action.loading,
      }
      case types.CLIENTIFO_SENDACT:
        return {
          ...state,
          act: action.act,
          sendAct: action.sendAct
        }
        case types.CLIENTIFO_RECVACT:
          return {
            ...state,
            sendAct: action.sendAct
          }
    default:
      return {
          ...state
      };
  }
};

const setInfo = (ipv4, href) => {
  return {
    type: "CLIENTIFO_SET",
    ipv4: ipv4,
    href: href,
    loading: false
  }
}

const sendAct = (act) => {
  return {
    type: "CLIENTIFO_SENDACT",
    act: act,
    sendAct: true,
  }
}


const recvAct = () => {
  return {
    type: "CLIENTIFO_RECVACT",
    sendAct: false,
  }
}

function ClientInfoComponent() {
  // const [statusInfo, statusInfoLoading] = useStatusInfo()
  const state = useSelector(state => state)
  const clientInfo = useSelector(state => state.clientInfo)
  const loginInfo = useSelector(state => state.authentication.login)
  const statusInfo = useSelector(state => state.authentication.status)
  const signupInfo = useSelector(state => state.authentication.signup)
  const clientInfoLoading = useSelector(state => state.clientInfo.loading)
  const location = useLocation()
  const dispatch = React.useCallback(useDispatch(), [])
  

  const RecordLog = (act) => {
    axios.post('/api/recordLog/recordLog', {
      ipv4: clientInfo?.ipv4 ?? '', 
      sns_type: statusInfo?.snsType ?? '',
      id: statusInfo?.id ?? '',
      email: statusInfo?.currentEmail ?? '',
      action: clientInfo.act
    }).then(() => {
      console.log('record success')
    }).catch(() => {
      console.log('record false')
    })
  }

  // clientinfo를 얻음
  useEffect(() => {
    const ClientInfo = () => {
      axios.get('/api/recordLog/getIP').then((res) => {
        const href=window.location.href
        const ipv4=res.data
        dispatch(setInfo(ipv4, href))
      })
    }
    ClientInfo()
    
  }, [dispatch])

  // 호스트 경로가 바뀔 때 마다 act
  useEffect(()=> {
    dispatch(sendAct(`move ${location.pathname}`))
  }, [location.pathname, dispatch])

  // 로그인
  useEffect(() => {
    if(loginInfo.status==='SUCCESS') {
      if(statusInfo.isLoggedIn) console.log('로그인')
      else console.log('로그아웃') // 로직 수정 필요
    } else {
      if(!statusInfo.isLoggedIn && statusInfo.valid) // 로직 수정 필요
      console.log('로그아웃')
    }
  }, [loginInfo.status, statusInfo, dispatch])

  // 회원가입
  useEffect(() => {
    if(signupInfo.status==='SUCCESS') console.log('회원가입 성공')
    else if(signupInfo.status==='FAILURE') console.log(`회원가입 오류 ${signupInfo.error}`)
  }, [signupInfo.status, signupInfo.error])


  useEffect(() => {
    console.log(state)
  })


  // recv
  useEffect(() => {
    if(clientInfo.sendAct && !clientInfoLoading) {
      RecordLog()
      dispatch(recvAct())
    }
  })


  return(<p style={{display: 'none'}}/>)
}

export {
  setInfo,
  sendAct,
  ClientInfoComponent,
}