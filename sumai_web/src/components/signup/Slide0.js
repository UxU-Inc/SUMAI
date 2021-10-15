import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, makeStyles, TextField } from "@material-ui/core";

import DialogContents from '../DialogContents'

import axios from 'axios';

const useStyles = makeStyles(theme => ({
  termsButton: {
    width: "105px",
    padding: "7.5px",
    fontSize: "12px",
    color: "#fff",
    fontFamily: "NotoSansKR-Light",
    background: theme.palette.primary.main,
    "&:hover": {
      background: theme.palette.hover.main,
    },
  },
  termsCheckBox: {
    margin: '0px',
    color: "#757575",
    fontFamily: "NotoSansKR-Light",
  },
}));

export default function Slide0(props) {
  const {
    enteredCallback,
    submitCallback,
    account,
    snackbarDispatch,
  } = props;

  const classes = useStyles();
  
  const [email, setEmail] = useState(account.email);
  const [name, setName] = useState(account.name);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCehck] = useState("");
  const [termsChecked, setTermsChecked] = useState(account.terms? true: false);
  const [privacyChecked, setPrivacyChecked] = useState(account.privacy? true: false);

  const [errorList, setErrorList] = useState({
    email: false,
    name: false,
    password: false,
    passwordCheck: false,
    terms: false,
    privacy: false,
  });

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordCheckRef = useRef();

  const [dialogStatus, setDialogStatus] = useState({
    type: undefined,
    open: false,
  });

  const openDialog = (contentType, bool) => {
    setDialogStatus({type: contentType, open: bool});
  }

  const validation = (type, value) => {
    if (type === "email") {
        const emailRegex = /^[0-9a-z]([-_.]?[0-9a-z])*@[0-9a-z]([-_.]?[0-9a-z])*\.[a-z]{2,}$/i;

        return {type: type, value: !emailRegex.test(value) && value !== ""}
    } else if (type === "name") {
        const nameRegex = /^[a-zA-Z가-힣0-9]{2,10}$/;

        return {type: type, value: !nameRegex.test(value) && value !== ""}
    } else if (type === "password") {
        const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[`~!@#$%^&+*()\-_+=.,<>/?'";:[\]{}\\|]).*$/;
        
        return {type: type, value: !passwordRegex.test(value) && value !== ""}
    } else if (type === "passwordCheck") {

        return  {type: type, value: false}
    } else if (type === "terms" && value) {
      return  {type: type, value: false}
    } else if (type === "privacy" && value) {
      return  {type: type, value: false}
    } else if (type === "certNumber") {
      return  {type: type, value: false}
    } 

    return null;
  }

  const isExistEmail = async (email) => {
    try {
      await axios.post('/api/account/checkSignupEmail', { email })
      
      return false;
    } catch(e) {
      return true;
    }
  }
  
  const handleChange = (type, e) => {
    const value = e.target.type === 'checkbox'? e.target.checked: e.target.value.trim();
    const f = {
      email: setEmail,
      name: setName,
      password: setPassword,
      passwordCheck: setPasswordCehck,
      terms: setTermsChecked,
      privacy: setPrivacyChecked,
    };

    f[type](value);

    const error = validation(type, value);

    if (!error) return;
    const newErrorList = {...errorList, [error.type]:error.value};

    setErrorList(newErrorList)
  }

  const submit = async () => {
    const conditions = [
      {condition: () => name === "" || errorList.name, act: () => nameRef.current.focus()},
      {condition: () => email === "" || errorList.email, act: () => emailRef.current.focus()},
      {condition: () => password === "" || errorList.password, act: () => passwordRef.current.focus()},
      {condition: () => password !== passwordCheck, act: () => {
        setErrorList({...errorList, passwordCheck: true});
        passwordCheckRef.current.focus();
      }},
      {condition: () => !termsChecked, act: () => { snackbarDispatch({errorCode: 1, type: 'error', message: '이용약관에 동의해주세요.'}) }},
      {condition: () => !privacyChecked, act: () => { snackbarDispatch({errorCode: 2, type: 'error', message: '개인정보처리방침에 동의해주세요.'}) }},
    ]

    const error = conditions.find(e => e.condition());
    if (error) {
      error.act();
      return null;
    }

    if (await isExistEmail(email)) {
      snackbarDispatch({errorCode: 3, type: 'error', message: '해당 이메일로 가입한 계정이 존재합니다.'})

      return null;
    }

    return {
      name: name,
      email: email,
      password: password,
      terms: termsChecked,
      privacy: privacyChecked,
    };
  }

  useEffect(() => {
    const entered = () => {
      if (!name) nameRef.current.focus();
      else passwordRef.current.focus();
    }

    enteredCallback.current = entered;
  })

  useEffect(() => {
    submitCallback.current = submit;
  });

  return (
    <>
      <TextField variant="outlined" onChange={(event) => handleChange("name", event)} error={errorList["name"]} defaultValue={account.name}
        fullWidth label="이름" placeholder="이름을 입력해주세요." name="nickname" id="nickname" autoComplete="nickname" style={{ margin: "15px 0px 7.5px 0px" }} inputRef={nameRef}
        helperText={errorList["name"] ? "한글, 영어만 사용, 2~10자리" : false} spellCheck="false" />
      <TextField variant="outlined" onChange={(event) => handleChange("email", event)} error={errorList["email"]} defaultValue={account.email}
        fullWidth label="이메일" placeholder="이메일을 입력해주세요." type="email" name="username" id="username" autoComplete="username" style={{ margin: "7.5px 0px" }} inputRef={emailRef}
        helperText={errorList["email"] ? "이메일 형식이 올바르지 않습니다." : false} spellCheck="false" />
      <TextField variant="outlined" onChange={(event) => handleChange("password", event)} error={errorList["password"]}
        fullWidth label="비밀번호" placeholder="비밀번호를 입력해주세요." type="password" name="newPassword" id="newPassword" autoComplete="new-password" style={{ margin: "7.5px 0px" }} inputRef={passwordRef}
        helperText={errorList["password"] ? "영어, 숫자, 특수문자 포함, 8~15자리" : false} />
      <TextField variant="outlined" onChange={(event) => handleChange("passwordCheck", event)} error={errorList["passwordCheck"]}
        fullWidth label="비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해주세요." type="password" name="confimPassword" id="confimPassword" autoComplete="new-password" style={{ margin: "7.5px 0px 15px 0px" }} inputRef={passwordCheckRef}
        helperText={errorList["passwordCheck"] ? "비밀번호가 다릅니다." : false} />


      <Box display="flex" style={{ marginTop: "10px" }}>
        <FormControlLabel label="이용약관 동의" className={classes.termsCheckBox} control={<Checkbox checked={termsChecked} onChange={(event) => handleChange("terms", event)} size="medium" value="termsChecked" color="primary" defaultValue={account.terms} />} />
        <Button className={classes.termsButton} onClick={() => openDialog('terms', true)} style={{ textDecoration: 'none', marginLeft: "auto", maxHeight: '35px', minWidth: '105px' }}>이용약관</Button>
      </Box>
      <Box display="flex">
        <FormControlLabel label="개인정보처리방침 동의" className={classes.termsCheckBox} control={<Checkbox checked={privacyChecked} onChange={(event) => handleChange("privacy", event)} size="medium" value="privacyChecked" color="primary" defaultValue={account.privacy} />} />
        <Button className={classes.termsButton} onClick={() => openDialog('privacy', true)} style={{ textDecoration: 'none', marginLeft: "auto", maxHeight: '35px', minWidth: '105px' }}>개인정보처리방침</Button>
      </Box>
      <DialogContents dialogStatus={dialogStatus} setDialogStatus={openDialog} />
    </>
  )
}