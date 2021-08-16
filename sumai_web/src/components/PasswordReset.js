import React, { useState, useRef, useCallback } from 'react'
import { withStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Card, CardActions, Button, Slide } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios'
import MuiAlert from '@material-ui/lab/Alert';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { checkSite } from '../functions/CheckSite';
import { returnUrl } from '../functions/util';

const root = checkSite();

const useStyles = theme => ({
    root: {
        minHeight: '100vh',
        flexDirection: 'column',
        '&::before, &::after': {
            minHeight: '30px',
            height: '24px',
            boxSizing: 'border-box',
            display: 'block',
            content: '""',
            flexGrow: 1,
        },
        display: 'flex',
    },
    card: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    imgLogo: {
        width: root.logoWidth,
        height: root.logoHeight,
        alt: root.site,
    },
    cardTitleText: {
        borderBottom: '1px solid #e0e0e0',
        color: '#0000008a',
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
    buttonLayout: {
        // padding: theme.spacing(0),
        padding: '20px 0px 0px 0px',
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
    },
})


const Header = (props) => {
    const { matches, classes } = props

    return (
        (matches && <CardHeader className={classes.cardTitleText}
            title={
                <Box display="flex" alignItems="center">
                    <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />
                    <Typography style={{ color: "#0000008A", fontSize: "28px", marginLeft: "10px" }}>비밀번호 찾기</Typography>
                </Box>
            }
        />) || (
            <Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />
                </Box>

                <Box display="flex" justifyContent="center" style={{ paddingTop: "10px", paddingBottom: '15px' }}>
                    <Typography style={{ color: "#0000008A", fontSize: "28px" }}>
                        비밀번호 찾기
                    </Typography>
                </Box>
            </Box>
        )
    )
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function PasswordResetComponent(props) {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [errorCode, setErrorCode] = useState(0)
    const [refresh, setRefresh] = useState(false)
    const [slideNumber, setSlideNumber] = useState(0)
    const [beforeSlide, setBeforeSlide] = useState()
    const [afterSlide, setAfterSlide] = useState()
    const { classes } = props

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    const focusInput = useRef();

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            onClickNextButton(e)
        }
    }

    const onChangeValue = (e) => {
        setEmail(e.target.value)



        const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,}$/i;
        setEmailError(!emailRegex.test(e.target.value) && e.target.value !== "")
    }

    const onClickNextButton = (e) => {
        if (slideNumber === 0) {
            if (emailError || email === '') { //focus 좀
                return
            }
            axios.post('/api/account/checkSignupEmail', { email: email, type: 'SUMAI' }).then((res) => { // 이메일 체크용으로 악용 가능?
                if (errorCode === 1) {
                    setRefresh(true)
                    setTimeout(() => {
                        setRefresh(false)
                    }, 200);
                } else {
                    setErrorCode(1)
                }
            }).catch((err) => {
                axios.post('/api/email/temporary/send', { email }).then((res) => {
                    setSlideNumber(slideNumber + 1)
                }).catch((err) => {
                    if (errorCode === 2) {
                        setRefresh(true)
                        setTimeout(() => {
                            setRefresh(false)
                        }, 200);
                    } else {
                        setErrorCode(2)
                    }
                })
            })
        } else if (slideNumber === 1) {
            window.location.assign(returnUrl())
        }
    }
    const onEnteredSlide = useCallback((e) => {
        if (slideNumber === 0)
            focusInput.current.focus()
    }, [slideNumber])
    const onEnterSlide = (e) => {
        e.style.position = 'relative'
        setBeforeSlide(afterSlide)
        setAfterSlide(e)
    }
    const onExitingSlide = (e) => {
        beforeSlide.style.position = 'absolute'
    }

    const onSnackbarClose = (e, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorCode(0)
    }
    return (
        <Box className={(matches ? classes.root : '')}>
            <Box display="flex" justifyContent="center" style={(!matches ? { minHeight: '' } : {})}>
                <Card elevation={3} className={classes.card} style={(matches ? { maxWidth: '450px', minWidth: '300px' } : { padding: '40px 40px 80px 40px', borderRadius: '0px', boxShadow: 'none' })}>
                    <Header matches={matches} classes={classes} />
                    <Box style={(matches ? { padding: "16px 10%", minHeight: '350px' } : { flex: '1' })}>
                        <Slide style={{ position: 'relative', }} direction="left" in={slideNumber === 0} timeout={{ exit: 0, enter: 0, }} mountOnEnter unmountOnExit onEnter={onEnterSlide} onExiting={onExitingSlide} onEntered={onEnteredSlide}>
                            <CardContent style={{ padding: 0 }}>
                                <TextField variant="outlined" value={email} onChange={onChangeValue} error={emailError} inputRef={focusInput}
                                    fullWidth label="이메일" placeholder="이메일을 입력해주세요." style={{ margin: "15px 0px 7.5px 0px" }}
                                    helperText={emailError ? "이메일 형식이 올바르지 않습니다." : false} onKeyPress={onKeyPress} spellCheck="false" />
                            </CardContent>
                        </Slide>
                        <Slide style={{ position: 'absolute', }} direction="left" in={slideNumber === 1} timeout={{ exit: 0, enter: 500, }} mountOnEnter unmountOnExit onEnter={onEnterSlide} onExiting={onExitingSlide}>
                            <CardContent style={{ padding: 0 }}>
                                <Typography style={{ fontFamily: 'NotoSansKR-Regular', color: '#424242', fontSize: '18px' }}>
                                    <span style={{ color: root.PrimaryColor }}>{email}</span>로 이메일을 전송하였습니다. 해당 메일을 통해 인증 해주세요.
                                </Typography>
                            </CardContent>
                        </Slide>
                    </Box>

                    <CardActions className={classes.buttonLayout}>
                        <Button className={classes.blueButton} style={{ borderRadius: (matches ? '0px' : '4px'), }} onClick={onClickNextButton}>{slideNumber === 0 ? '다음' : '완료'}</Button>
                    </CardActions>
                </Card>
            </Box>

            <Snackbar open={errorCode !== 0 && !refresh} autoHideDuration={3000} onClose={onSnackbarClose}>
                <Alert severity="error">
                    {
                        (errorCode === 1 && "존재하지 않는 계정입니다.") ||
                        (errorCode === 2 && "죄송합니다. 메일 보내기에 실패하였습니다.")
                    }
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default withStyles(useStyles)(PasswordResetComponent);