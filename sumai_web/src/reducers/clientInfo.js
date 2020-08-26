// 리듀서는 dispatch 함수로 부터 전달받은 action 객체의 type 값에 따라 state 를 변경하는 함수입니다.
import * as types from '../actions/ActionTypes';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'

 
const initialState = {
    ipv4: '',
    href: '',
    loading: false,
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
    loading: true
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

function useLoginInfo() {
  const [loginInfo, setLoginInfo] = useState(null)

  useEffect(() => {
    axios.get('/api/account/getinfo').then((res)=> { // 나중에 session 추적이 아닌 redux 추적으로 수정해야함
      setLoginInfo(res.data.info)
    })
  }, [])

  return [loginInfo]
}

function ClientInfoComponent() {
  const [loginInfo] = useLoginInfo()
  const clientInfo = useSelector(state => state.clientInfo)
  const loading = useSelector(state => state.clientInfo.loading)
  const location = useLocation()
  const dispatch = useDispatch()
  

  const RecordLog = (act) => {
    axios.post('/api/recordLog/recordLog', {
      ipv4: clientInfo.ipv4 ?? '', 
      sns_type: loginInfo.snsType ?? '',
      id: loginInfo.id ?? '',
      email: loginInfo.email ?? '',
      action: clientInfo.act
    }).then((res) => {
      console.log('record success')
    }).catch(() => {
      console.log('record false')
    })
  }
  React.useEffect(() => {
    axios.get('/api/recordLog/getIP').then((res) => {
      const href=window.location.href
      const ipv4 = res.data
      dispatch(setInfo(ipv4, href))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 최초 접속 href, 새로고침하거나 link를 통해서 접속할 때

  React.useEffect(()=> {
    if(loading){
      console.log(123)
      dispatch(sendAct(`move ${location.pathname}`))
    }
  }, [loading, location.pathname])

  useEffect(() => {
    if(clientInfo.sendAct) {
      RecordLog()
      dispatch(recvAct())
    }else {
      console.log('no act')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientInfo.act])

  return(<p style={{display: 'none'}}/>)
}

export {
  setInfo,
  sendAct,
  ClientInfoComponent,
}