import React, {useEffect, useState} from 'react';
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


function PasswordChangeMassage(props) {
    const { enqueueSnackbar } = useSnackbar()
    const { code, setCode } = props

    React.useEffect(() => {
        console.log(code)
        if(code === 1) enqueueSnackbar('비밀번호가 변경되었습니다.', {variant: "success"} )
        if(code === 2) enqueueSnackbar('해당 계정이 존재하지 않습니다.', {variant: "error"})
        if(code === 3) enqueueSnackbar('현재 비밀번호가 틀립니다.', {variant: "error"})
        if(code === 4) enqueueSnackbar('로그인 상태가 아닙니다.', {variant: "error"})
        if(code !== 1) setCode(0)
    }, [code])

    return (<React.Fragment></React.Fragment>)
}
function EmailLoginComponent(props) {
    const location = useLocation()
    const history = useHistory()
    const [passwordChange, setPasswordChange] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const [passwordChangeError, setPasswordChangeError] = useState(false)
    const [passwordCheckError, setPasswordCheckError] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [slideNumber, setSlideNumber] = useState(0)
    const [beforeSlide, setBeforeSlide] = useState()
    const [afterSlide, setAfterSlide] = useState() // 나중에 slide function화
    
    const { classes } = props;

    useEffect(() => {
        const id=location.search?.slice(1)?.split('id=')[1]?.split('&')[0]
        const cert=location.search?.slice(1)?.split('cert=')[1]?.split('&')[0]
        axios.post('/api/email/temporary/login', {id: id, cert: cert}).then((res) => {
            if(res.data.code === 0) {
                history.push('/accounts/password')
            }
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
        } else if (type === "passwordCheck") {
            // 비밀번호 확인
            setPasswordCheckError((passwordChangeError || passwordChange !== value) && value !== "")
        }
    }

    
    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            // this.onClickSave();
        }
    }

    const onClickNextButton = (e) => {
        if(slideNumber === 0) {
            if(!(passwordChangeError && passwordCheckError)) {
                axios.post('/api/email/temporary/login/change', {password: passwordChange}).then((res) => {
                    if(res.data.code === 0) {
                        console.log('성공한듯')
                    }else{
                        console.log('실패한듯')
                    }
                })
            }else{
                console.log('입력 에러', passwordChangeError, passwordCheckError)
            }
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
                <Card elevation={3} style={{minWidth: "450px", position: 'relative'}}>
                    <CardHeader className={classes.cardTitleText} 
                        title={
                            <Box display="flex" alignItems="center">
                                <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                                <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px"}}>비밀번호 변경</Typography>
                            </Box>
                        }   
                    />
                    <Box style={{padding: "16px 10%", }}>
                        <Slide  style={{position: 'relative', }} direction="left" in={slideNumber===0} mountOnEnter unmountOnExit onEnter={onEnterSlide} onExiting={onExitingSlide}>
                            <CardContent style={{padding: 0}}>
                                <TextField variant="outlined" value={passwordChange} onChange={(e) => handleChange(e, "passwordChange")} error={passwordChangeError}
                                        fullWidth label="변경할 비밀번호 입력" type="password" style={{margin: "30px 0px 7.5px 0px"}}
                                        helperText={passwordChangeError? "영어, 숫자, 특수문자 포함, 8~15자리": false} onKeyPress={onKeyPress}/>
                                <TextField variant="outlined" value={passwordCheck} onChange={(e) => handleChange(e, "passwordCheck")} error={passwordCheckError}
                                        fullWidth label="비밀번호 확인" type="password" style={{margin: "7.5px 0px 15px 0px"}}
                                        helperText={passwordCheckError? "비밀번호가 다릅니다.": false} onKeyPress={onKeyPress}/>
                            </CardContent>
                        </Slide>
                        <Slide  style={{position: 'absolute', }} direction="left" in={slideNumber===1} mountOnEnter unmountOnExit onEnter={onEnterSlide} onExiting={onExitingSlide}>
                            <CardContent style={{padding: 0}}>
                                <Typography>
                                    완료?
                                </Typography>
                            </CardContent>
                        </Slide>
                    </Box>

                    <CardActions className={classes.buttonLayout}>
                    <Button className={classes.blueButton} onClick={onClickNextButton}>{slideNumber===0? '다음': '완료'}</Button>
                    </CardActions>
                </Card>
            </Box>
            {/* <SnackbarProvider maxSnack={3}> 
                <PasswordChangeMassage code={code} setCode={handleCode}/>
            </SnackbarProvider> */}
        </Box>
    )
}
export default withStyles(useStyles)(EmailLoginComponent);