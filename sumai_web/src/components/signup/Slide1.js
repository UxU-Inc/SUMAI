import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, makeStyles, TextField } from "@material-ui/core";
import clsx from 'clsx';

import moment from "moment"

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: "0px 15px",
  },
  displayNone: {
    display: "none",
  },
}));


export default function Slide1(props) {
  const { 
    enteredCallback,
    submitCallback,
    sendCertMail,
  } = props;

  const classes = useStyles();

  const [birthday, setBirthday] = useState({
    year: '',
    month: '',
    day: '',
  });

  const [genderOption, setGenderOption] = useState("");
  const [genderCustom, setGenderCustom] = useState("");

  const birthdayRef = [useRef(), useRef(), useRef()];

  const [errorList, setErrorList] = useState({
    empty: false,
    year: false,
    month: false,
    day: false,
    valid: false,
  });

  const [birthdayErrorMessage, setBirthdayErrorMessage] = useState('');

  const showErrorMessage = (errors) => {
    // eslint-disable-next-line no-sequences
    errors = errors.reduce((obj, error) => (obj[error.type] = error.error, obj), {});
    const newErrorList = {...errorList, ...errors};

    const messages = [
      {condition: newErrorList.year, message: '올바른 연도를 입력해 주세요.'},
      {condition: newErrorList.month, message: '올바른 월을 입력해 주세요.'},
      {condition: newErrorList.day, message: '올바른 일을 입력해 주세요.'},
      {condition: newErrorList.empty, message: '생년월일을 정확히 입력해 주세요.'},
      {condition: newErrorList.valid, message: '올바른 생년월일을 입력해 주세요.'},
    ]

    const message = messages.find((o) => o.condition);

    setErrorList({...newErrorList});
    setBirthdayErrorMessage(message?.message)

    return newErrorList;
  }

  const onFocusBirthday = (type) => {
    const state = ['empty', 'valid'];

    const disableState = state.filter((v) => errorList[v]).map((v) => {return {type: v, error: false}});
    
    showErrorMessage(disableState);
  }

  const onBlurBirthday = (type) => {
    const error = validationBirthday(type);

    showErrorMessage([error]);
  }

  const validationBirthday = (type) => {
    const currentYear = parseInt(moment().format('YYYY'))

    const value = parseInt(birthday[type]);

    const errorConditions = {
      year: [
        (y) => y < 1000 || 10000 <= y,
        (y) => y < 1890,
        (y) => y > currentYear,
      ],
      month: [
        (m) => m < 1 || 12 < m,
      ],
      day: [
        (d) => d < 1 || 31 < d,
      ],
      empty: [
        () => ['year', 'month', 'day'].some((value) => birthday[value] === ''),
      ],
      valid: [
        () => {
          const birthDate = [
            birthday.year,
            (birthday.month.length === 1? '0': '') + birthday.month,
            (birthday.day.length === 1? '0': '') + birthday.day,
          ].join("")
          
          return !moment(birthDate).isValid() && moment().isBefore(moment(birthDate), 'date');
        }
      ],
    }

    const conditionResult = errorConditions[type].map((f) => f(value))

    const error = conditionResult.some((c) => c === true);

    return {type: type, error: error};
  }

  const handleBirthday = (type, value) => {
    const re = /^[0-9\b]+$/;

    if (!(re.test(value) || value === ''))
      return;

    setBirthday({...birthday, [type]: value});
  }

  const handleChange = (type, e) => {
    const value = e.target.type === 'checkbox'? e.target.checked: e.target.value.trim();
    const f = {
      year: (value) => handleBirthday(type, value),
      month: (value) => handleBirthday(type, value),
      day: (value) => handleBirthday(type, value),
      genderOption: setGenderOption,
      genderCustom: setGenderCustom,
    };

    f[type](value);
  }

  const getBirthDate = () => {
    if (birthday.year === '' && birthday.day === '') {

      return '';
    } else {
      const birthDate = [
        birthday.year,
        (birthday.month.length === 1? '0': '') + birthday.month,
        (birthday.day.length === 1? '0': '') + birthday.day,
      ].join("")
      
      const errorConditions = ['empty', 'year', 'month', 'day', 'valid',];
  
      const error = errorConditions.map((f) => validationBirthday(f));
  
      if (error.some((o) => o.error === false)) return null;
  
      return birthDate;
    }
  }
  
  const submit = async () => {
    const gender = genderOption === '사용자 지정'? genderCustom: genderOption;

    const birthDate = getBirthDate();

    if (birthDate === null) return null;

    sendCertMail();

    return {birthday: birthDate, gender: (gender === ''? undefined: gender)};
  }

  useEffect(() => {
    const entered = () => birthdayRef[0].current.focus();

    enteredCallback.current = entered;
  })

  useEffect(() => {
    submitCallback.current = submit;
  });

  return (
    <Box height='388px'>
      <Typography style={{ color: '#0000008A', fontFamily: 'NotoSansKR-Regular' }}>생년월일 (선택사항)</Typography>
      <Box display="flex" mt={2}>
        <TextField fullWidth variant="outlined" value={birthday.year || ""} onChange={event => handleChange("year", event)}
          label={"연"} style={{ minWidth: "120px" }} spellCheck="false" inputRef={birthdayRef[0]} 
          error={errorList.year} onFocus={() => onFocusBirthday()} onBlur={() => onBlurBirthday('year')}/>

        <FormControl variant="outlined" className={classes.formControl} style={{ width: "100%" }}>
          <InputLabel id="demo-simple-select-outlined-label">월</InputLabel>
          <Select labelId="demo-simple-select-outlined-label" id="demo-simple-select-outlined" value={birthday.month} onChange={event => handleChange("month", event)} label="월" 
            error={errorList.month} onFocus={() => onFocusBirthday()} onBlur={() => onBlurBirthday('month')}>
            <MenuItem value={"01"}>1</MenuItem> <MenuItem value={"02"}>2</MenuItem> <MenuItem value={"03"}>3</MenuItem>
            <MenuItem value={"04"}>4</MenuItem> <MenuItem value={"05"}>5</MenuItem> <MenuItem value={"06"}>6</MenuItem>
            <MenuItem value={"07"}>7</MenuItem> <MenuItem value={"08"}>8</MenuItem> <MenuItem value={"09"}>9</MenuItem>
            <MenuItem value={"10"}>10</MenuItem> <MenuItem value={"11"}>11</MenuItem> <MenuItem value={"12"}>12</MenuItem>
          </Select>
        </FormControl>

        <TextField fullWidth variant="outlined" value={birthday.day || ""} onChange={event => handleChange("day", event)}
          label={"일"} style={{ width: "100%" }} spellCheck="false" inputRef={birthdayRef[2]}
          error={errorList.day} onFocus={() => onFocusBirthday()} onBlur={() => onBlurBirthday('day')} />
      </Box>

      <Typography variant="body2" style={{ fontFamily: "NotoSansKR-Regular", color: "#f44336", marginTop: "3px" }}>
        &nbsp;{birthdayErrorMessage}&nbsp;
      </Typography>

      <FormControl variant="outlined" style={{ width: '100%', marginTop: "10px" }}>
        <InputLabel htmlFor="gender">성별 (선택사항)</InputLabel>
        <Select native label="성별 (선택사항)" labelId='gender' onChange={event => handleChange("genderOption", event)} defaultValue=''>
          <option aria-label="None" value="" disabled hidden />
          <option value={"여성"}>여성</option>
          <option value={"남성"}>남성</option>
          <option value={"공개 안함"}>공개 안함</option>
          <option value={"사용자 지정"}>사용자 지정</option>
        </Select>
      </FormControl>

      <TextField fullWidth variant="outlined" value={genderCustom || ''} label="성별 입력" style={{ width: "100%", marginTop: "10px" }} onChange={event => handleChange("genderCustom", event)}
        className={clsx("none", { [classes.displayNone]: genderOption !== "사용자 지정" })} />
    </Box>
  )
}