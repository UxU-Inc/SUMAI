// 리듀서는 dispatch 함수로 부터 전달받은 action 객체의 type 값에 따라 state 를 변경하는 함수입니다.
import * as types from '../actions/ActionTypes';
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
 
const initialState = {
    ipv4: '',
    href: ''
};
 
export default function reducer(state=initialState, action) {
  switch(action.type) {
    case types.CLIENTIFO_GET:
      return {
        ...state,
      }
    case types.CLIENTIFO_SET:
      return {
        ipv4: 'action.ipv4',
        href: 'action.href'
      }
    default:
      return {
          ...state
      };
  }
};

export const ClientInfo = (props) => {
    const state=useSelector(state => state)
    const dispatch=useDispatch(reducer)

    useEffect(() => {
        dispatch({type: 'CLIENTIFO_SET', ipv4:'123', href:'123'})
    })

    return [state]
}