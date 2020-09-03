import React, {useEffect, useState, useRef} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import imgLogo from '../images/sumai_logo_blue.png';
import Box from '@material-ui/core/Box';
import { Card, CardActions, Button, Slide } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import * as root from '../rootValue';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useHistory, useLocation } from 'react-router-dom';

const useStyles = theme => ({
    root: {
        minHeight: '100vh',
        flexDirection: 'column',
        '&::before, &::after' : {
            minHeight: '30px',
            height: '24px',
            boxSizing: 'border-box',
            display: 'block',
            content: '""',
            flexGrow: 1,
        },
        display: 'flex',
    },
    imgLogo: {
        width: 80,
        height: 28.2,
        alt: 'SUMAI',
    },
    cardTitleText: {
        borderBottom: '1px solid #e0e0e0',
        color: '#0000008a',
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
    buttonLayout: {
        padding: theme.spacing(0),
    },
    blueButton: {
        variant: 'contained',
        color: '#ffffff',
        background: root.PrimaryColor,
        "&:hover": {
          background: root.HoberColor
        },
        width: '100%',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderRadius: '0px',
    },
}) 

const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

    return [ htmlElRef, setFocus ] 
}

function EmailLoginComponent(props) {
    const location = useLocation()
    const history = useHistory()
    const [passwordChange, setPasswordChange] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [passwordChangeError, setPasswordChangeError] = useState(false)
    const [passwordCheckError, setPasswordCheckError] = useState(false)
    const [slideNumber, setSlideNumber] = useState(0)
    const [beforeSlide, setBeforeSlide] = useState()
    const [afterSlide, setAfterSlide] = useState() // 나중에 slide function화
    const id=location.search?.slice(1)?.split('id=')[1]?.split('&')[0]
    const cert=location.search?.slice(1)?.split('cert=')[1]?.split('&')[0]
    const [inputPasswordChange, inputPasswordChangeFocus] = useFocus()
    const [inputPasswordCheck, inputPasswordCheckFocus] = useFocus()
    
    const { classes } = props;

    useEffect(() => {
        axios.post('/api/email/temporary/login/check', {id: id, cert: cert}).then((res) => {
            if(res.data.code !== 0) {
                history.push('/')
            }
        }).catch(()=> {
            history.push('/')
        })
    }, [])

    const handleChange = (e, type) => {
        if(type === "passwordChange") {
            setPasswordChange(e.target.value.trim())
        } else if (type === "passwordCheck") {
            setPasswordCheck(e.target.value.trim())
        }
        validation(e.target.value.trim(), type)
    }

    const validation = (value, type) => {
        if (type === "passwordChange") {
            // 비밀번호 유형 검사 (영어, 숫자 8~15자리)
            const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[`~!@#$%^&+*()\-_+=.,<>/?'";:[\]{}\\|]).*$/;
            setPasswordChangeError(!passwordRegex.test(value) && value !== "")
        }
    }

    
    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.onClickNextButton(e);
        }
    }

    const onClickNextButton = (e) => {
        if(slideNumber === 0) {
            if(passwordChangeError || passwordChange === ''){
                console.log(inputPasswordChange)
                inputPasswordChangeFocus()
            } else if(passwordCheckError || passwordCheck !== passwordChange) {
                inputPasswordCheckFocus()
                setPasswordCheckError(true)
            }else{
                axios.post('/api/email/temporary/login/change', {id: id, cert: cert, password: passwordChange}).then((res) => {
                    if(res.data.code === 0) { // 인증 성공
                        setSlideNumber(1)
                    }else{
                        history.push('/')
                    }
                })
            }
        } else if(slideNumber === 1) {
            history.push('/')
        }
    }
    const onEnterSlide = (e) => {
        e.style.position='relative'
        setBeforeSlide(afterSlide)
        setAfterSlide(e)
    }
    const onExitingSlide = (e) => {
        beforeSlide.style.position='absolute'
    }

    return(
        
        <Box className={classes.root}>
            <Box display="flex" justifyContent="center" >
                <Card elevation={3} style={{maxWidth: '450px', width:'100%', minWidth:'300px', position: 'relative'}}>
                    <CardHeader className={classes.cardTitleText} 
                        title={
                            <Box display="flex" alignItems="center">
                                <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                                <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px"}}>비밀번호 변경</Typography>
                            </Box>
                        }   
                    />
                    <Box style={{padding: "16px 10%", minHeight:'350px'}}>
                        <Slide style={{position: 'relative', }} direction="left" in={slideNumber===0} mountOnEnter unmountOnExit onEnter={onEnterSlide} onExiting={onExitingSlide}>
                            <CardContent style={{padding: 0}}>
                                    <TextField variant="outlined" value={'ksm@test.com'} 
                                            fullWidth label="이메일" style={{margin: "15px 0px 7.5px 0px"}} autoComplete='new-password'/>
                                    <TextField variant="outlined" value={passwordChange} onChange={(e) => handleChange(e, "passwordChange")} error={passwordChangeError} autoComplete='new-password'
                                            fullWidth label="변경할 비밀번호 입력" type="password" style={{margin: "30px 0px 7.5px 0px"}} ref={inputPasswordChange} autoFocus
                                            helperText={passwordChangeError? "영어, 숫자, 특수문자 포함, 8~15자리": false} onKeyPress={onKeyPress}/>
                                    <TextField variant="outlined" value={passwordCheck} onChange={(e) => handleChange(e, "passwordCheck")} error={passwordCheckError}
                                            fullWidth label="비밀번호 확인" type="password" style={{margin: "7.5px 0px 15px 0px"}} ref={inputPasswordCheck} autoFocus
                                            helperText={passwordCheckError? "비밀번호가 다릅니다.": false} onKeyPress={onKeyPress}/>
                            </CardContent>
                        </Slide>
                        <Slide style={{position: 'absolute', }} direction="left" in={slideNumber===1} mountOnEnter unmountOnExit onEnter={onEnterSlide} onExiting={onExitingSlide}>
                            <CardContent style={{padding: 0}}>
                                <Typography style={{fontFamily: 'NotoSansKR-Regular', color: '#424242', fontSize: '18px'}}>
                                    비밀번호 변경이 완료되었습니다. <br/>변경된 비밀번호로 로그인 해주세요.
                                </Typography>
                            </CardContent>
                        </Slide>
                    </Box>

                    <CardActions className={classes.buttonLayout}>
                    <Button className={classes.blueButton} onClick={onClickNextButton}>{slideNumber===0? '다음': '완료'}</Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    )
}
export default withStyles(useStyles)(EmailLoginComponent);