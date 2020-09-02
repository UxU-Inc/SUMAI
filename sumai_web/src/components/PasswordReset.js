import React, { useState, useRef, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Box from '@material-ui/core/Box';
import { Card, CardActions, Button, Slide } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import imgLogo from '../images/sumai_logo_blue.png';
import * as root from '../rootValue';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';
import axios from 'axios'
import { useHistory } from 'react-router-dom';

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

function PasswordResetComponent(props) {
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [errorCode, setErrorCode] = useState(0)
    const [refresh, setRefresh] = useState(false)
    const [slideNumber, setSlideNumber] = useState(0)
    const [beforeSlide, setBeforeSlide] = useState()
    const [afterSlide, setAfterSlide] = useState()
    const {classes} = props


    // useEffect(() => {
    //     let eventSource = new EventSource("http://localhost:3306/api/sendEmail/temporary/wait")
    //     eventSource.onmessage = e => console.log(JSON.parse(e.data))
    // }, [])


    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            onClickNextButton(e)
        }
    }

    const onChangeValue = (e) => {
        setEmail(e.target.value)


        
        const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,}$/i;
        setEmailError(!emailRegex.test(e.target.value) && e.target.value !== "")
    }

    const onClickNextButton = (e) => {
        if(slideNumber===0) {
            if(emailError) { //focus 좀
                return 
            }
            axios.post('/api/account/checkSignupEmail', {email}).then((res) => { // 이메일 체크용으로 악용 가능?
                if(errorCode===1){
                    setRefresh(true)
                    setTimeout(() => {
                        setRefresh(false)
                    }, 200);
                } else {
                    setErrorCode(1)
                }
            }).catch((err) => {
                setSlideNumber(slideNumber+1)
                axios.post('/api/email/temporary/send', {email}).then((res) => {
                    console.log(res)
                })  
            })
        }else if(slideNumber===1) {
             history.push("/")
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
    return (
        <Box className={classes.root}>
            <Box display="flex" justifyContent="center" >
                <Card elevation={3} style={{minWidth: "450px", position: 'relative'}}>
                    <CardHeader className={classes.cardTitleText} 
                        title={
                            <Box display="flex" alignItems="center">
                                <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                                <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px"}}>비밀번호 찾기</Typography>
                            </Box>
                        }   
                    />
                    <Box style={{padding: "16px 10%", }}>
                        <Slide  style={{position: 'relative', }} direction="left" in={slideNumber===0} mountOnEnter unmountOnExit onEnter={onEnterSlide} onExiting={onExitingSlide}>
                            <CardContent style={{padding: 0}}>
                                <TextField autoFocus variant="outlined" value={email} onChange={onChangeValue} error={emailError}
                                    fullWidth label="이메일" placeholder="이메일을 입력해주세요." style={{margin: "15px 0px 7.5px 0px"}}
                                    helperText={emailError? "이메일 형식이 올바르지 않습니다.": false} onKeyPress={onKeyPress} spellCheck="false"/>
                            </CardContent>
                        </Slide>
                        <Slide  style={{position: 'absolute', }} direction="left" in={slideNumber===1} mountOnEnter unmountOnExit onEnter={onEnterSlide} onExiting={onExitingSlide}>
                            <CardContent style={{padding: 0}}>
                                <Typography>
                                    <span style={{color:root.PrimaryColor}}>{email}</span>로 이메일을 전송하였습니다. <br/>해당 메일을 통해 인증 해주세요.
                                </Typography>
                            </CardContent>
                        </Slide>
                    </Box>

                    <CardActions className={classes.buttonLayout}>
                    <Button className={classes.blueButton} onClick={onClickNextButton}>{slideNumber===0? '다음': '완료'}</Button>
                    </CardActions>
                </Card>
            </Box>

            <Snackbar open={errorCode!==0 && !refresh}> 
                <Alert severity="error">
                    {
                        (errorCode===1 && "해당 이메일로 가입한 계정은 존재하지 않습니다.")
                    }
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default withStyles(useStyles)(PasswordResetComponent);