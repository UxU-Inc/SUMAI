// 리듀서는 dispatch 함수로 부터 전달받은 action 객체의 type 값에 따라 state 를 변경하는 함수입니다.
import * as types from '../actions/ActionTypes';
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

 
const initialState = {
    ipv4: '',
    href: ''
};
 
export default function ClientInfo(state=initialState, action) {
  switch(action.type) {
    case types.CLIENTIFO_GET:
      return {
        ...state,
      }
    case types.CLIENTIFO_SET:
      return {
        ipv4: action.ipv4,
        href: action.href
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
    href: href
  }
}

function ClientInfoComponent(props) {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  React.useEffect(() => {
    const href=window.location.href
    fetch('https://geoip-db.com/json')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong ...');
      }
    })
    .then(data => console.log(data))
    .catch(error => console.log(error));
  }, [])

  React.useEffect(()=> {
      console.log(state)
  })
  return(<p/>)
}

export {
  setInfo,
  ClientInfoComponent,
}