import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField } from "@material-ui/core";

import axios from 'axios';
import useLogin from '../../hook/useLogin';

import { checkSite } from '../../functions/CheckSite';
import { returnUrl } from '../../functions/util';

const root = checkSite();

export default function Slide2(props) {
  const { 
    enteredCallback,
    submitCallback,
    sendCertMail,
    account,
    snackbarDispatch,
  } = props;

  const [certNumber, setCertNumber] = useState('');

  const [certError, setCertError] = useState(false);

  const [countMailsSend, setCountMailsSend] = useState(3);

  const certRef = useRef();

  const loginRequest = useLogin();

  const onClickSendMail = async () => {
    try {
      if (countMailsSend > 0) {
        await sendCertMail();
        snackbarDispatch({type: 'success', message: <>인증 메일을 다시 전송했습니다.<br />(남은 전송 횟수: {countMailsSend - 1})</>})
        setCountMailsSend(countMailsSend - 1);
      } else {
        snackbarDispatch({type: 'error', message: '더 이상 인증 메일을 보낼 수 없습니다.'})
      }
    } catch(e) {
      snackbarDispatch({type: 'error', message: '메일을 보내는데 실패했습니다.'})
    }
  }

  const handleChange = (type, e) => {
    const value = e.target.type === 'checkbox'? e.target.checked: e.target.value.trim();
    const f = {
      certNumber: setCertNumber,
    };

    f[type](value);

    setCertError(false);
  }

  const submit = async () => {
    try {

      const response = await axios.post('/api/email/EmailCertification', { ...account, cert: certNumber })
      
      if (response.data.code !== 0) {
        setCertError(true);

        return false;
      }

      const loginResponse = await loginRequest(account.email, account.password)

      if (loginResponse.success) {
        window.location.assign(returnUrl());
        return true;

      } else {
        snackbarDispatch({type: 'error', message: '죄송합니다. 서버에 오류가 발생하여 처리할 수가 없습니다.(1)'})
        return false;

      }
      
    } catch (e) {
      console.log(e);
      snackbarDispatch({type: 'error', message: '죄송합니다. 서버에 오류가 발생하여 처리할 수가 없습니다.(2)'})
      return false;
    }
  }

  useEffect(() => {
    const entered = () => certRef.current.focus();

    enteredCallback.current = entered;
  })


  useEffect(() => {
    submitCallback.current = submit;
  });

  return (
    <>
      <Box height='auto' mt={2}>
        <Typography variant='subtitle1' align="center" style={{ color: '#0000008A' }}>
          인증 번호가 <span style={{ color: root.PrimaryColor }}>{account.email}</span>(으)로 전송되었습니다.<br /><br /><br />
        </Typography>
      </Box>
      <TextField variant="outlined" onChange={(event) => handleChange("certNumber", event)} error={certError}
        fullWidth label="인증 번호" placeholder="인증 번호를 입력해주세요." style={{ margin: "15px 0px 7.5px 0px" }} inputRef={certRef}
        helperText={certError ? "인증 번호가 다릅니다." : false} spellCheck="false" />
      <Box height='auto' mt={5}>
        <Typography variant='subtitle2' align="center" style={{ color: '#0000008A' }}>
          이메일을 확인할 수 없나요?<br />
          스팸편지함 확인 또는 <span onClick={onClickSendMail} style={{ color: root.PrimaryColor, cursor: 'pointer' }}>인증 메일 다시 보내기</span>
        </Typography>
      </Box>
    </>
  )
}