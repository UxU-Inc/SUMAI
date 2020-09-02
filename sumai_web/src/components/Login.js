import React, { Component } from 'react'; 
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import imgLogo from '../images/sumai_logo_blue.png';
import Typography from '@material-ui/core/Typography';
import * as root from '../rootValue';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import googleLogo from '../images/btn_google_light_normal_ios@3x.png';
import kakaoLogo from '../images/kakaolink_btn_small.png';
import naverLogo from '../images/naver_btn_green.png';
import facebookLogo from '../images/facebook_icon.png';
import clsx from 'clsx';

const useStyles = theme => ({
    root: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        margin: '-320px 0 0 -225px',
        minHeight: '600px',
    },
    rootMob: {
        padding: "40px",
    },
    cardTitleText: {
        borderBottom: '1px solid #e0e0e0',
        color: '#0000008a',
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
    imgLogo: {
        width: 80,
        height: 28.2,
        alt: 'SUMAI',
    },
    textInput: {
        background: '#ffffff',
        width: '100%',
        height: '100%',
        lineHeight: '35px',
        minHeight: theme.spacing(20),
        fontSize: '24px',
        fontFamily: 'NotoSansKR-Black',
        border: 'none',
        outline: 'none',
        resize: 'none',
    },
    loginButtonLayout: {
        padding: theme.spacing(0),
    },
    loginButton: {
        variant: 'contained',
        color: '#ffffff',
        background: root.PrimaryColor,
        "&:hover": {
          background: root.HoberColor,
        },
        width: '100%',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderRadius: '0px',
    },
    loginButtonMob: {
        variant: 'contained',
        color: '#ffffff',
        background: root.PrimaryColor,
        "&:hover": {
          background: root.HoberColor,
        },
        width: '100%',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    accountCreateButton: {
        padding: "7.5px 10px", 
        fontSize: "15px", 
        color: root.PrimaryColor,
        "&:hover": {
          background: "none"
        },
    },
    termsButton: {
        padding: "7.5px 10px", 
        fontSize: "12px", 
        color: "#757575",
        fontFamily: "NotoSansKR-Light",
        "&:hover": {
          background: "none"
        },
        marginTop: "10px",
    },
    loginStyle: {
        height: "50px",
    },
    displayNone: {
      display: "none",
    },
})



function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Login extends Component{ 
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            passworderror: false,
            cookieState: true, 
            loginerror: false,
            snsloginerror: '',
            toomanyerror: false,
        }
        this.textFieldRef = [React.createRef(), React.createRef()]
    }

    handleChange = (type, e) => {
        if(type === "email") {
            this.setState({
                email: e.target.value.trim(),
                loginerror: false,
                snsloginerror: '',
                toomanyerror: false,
            })
        } else if (type === "password") {
            this.setState({
                password: e.target.value.trim(),
                loginerror: false,
                snsloginerror: '',
                toomanyerror: false,
            })
        }
    }
    snackBarHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    }
    onClickLogin = () => {
        if(this.state.email === "") {
            this.textFieldRef[0].current.focus()
        } else if(this.state.password === "" || this.state.loginerror) {
            this.textFieldRef[1].current.focus()
        } else {
            this.props.onLogin(this.state.email, this.state.password).then(data => {
                if (data.success) {
                    if(data.error === 92) {  // 로그인이 확인됐으나 쿠키 차단 상태
                        this.setState({
                            cookieState: false,
                        })
                    }
                    
                } else if (data.error === 429) {
                    this.setState({
                        password: "",
                        loginerror: false,
                        snsloginerror: '',
                        toomanyerror: true,
                    })
                } else {
                    this.textFieldRef[1].current.focus()
                    this.setState({
                        password: "",
                        loginerror: true,
                        snsloginerror: '',
                        toomanyerror: false,
                    })
                }
            })
            
        }
    }
    onKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.onClickLogin();
        }
    }
    SNSLogin = (SNS) => {
        this.setState({
            loginerror: false,
            snsloginerror: '',
            toomanyerror: false,
        })
        this.props.onSNSLogin(SNS).then(data => {
            if (data.success) {
                
            } else {
                let snsloginerror = ''
                switch(data.error) {
                    case "GOOGLE": snsloginerror = "구글"; break;
                    case "NAVER": snsloginerror = "네이버"; break;
                    case "KAKAO": snsloginerror = "카카오"; break;
                    case "FACEBOOK": snsloginerror = "페이스북"; break;
                    case "NORMAL": snsloginerror = "일반"; break;
                    default:
                }
                this.setState({
                    snsloginerror: snsloginerror,
                })
            }
        })
    }

    render() { 
        const { classes } = this.props;

        /**************************************************** PC *****************************************************/
        if(isWidthUp('sm', this.props.width)) {
            return ( 
                <div className={classes.root} >
                    <Grid container justify="center">
                        <Card elevation={3} style={{minWidth: "450px", maxWidth: "450px"}}>
                            <CardHeader className={classes.cardTitleText}
                                        title={
                                                <Box display="flex" alignItems="center" >
                                                    <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
    
                                                    <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px"}}>
                                                        로그인
                                                    </Typography>
                                                </Box>
                                            }  
                            />
                            <CardContent style={{padding: "16px 10%"}}>
                                <TextField variant="outlined" autoFocus value={this.state.email} onChange={this.handleChange.bind(this, "email")} error={this.state.loginerror}
                                    fullWidth label="이메일" placeholder="이메일을 입력해주세요." color="primary" style={{height: "70px", marginTop: "15px", fontFamily: "NotoSansKR-Thin"}} inputRef={this.textFieldRef[0]}
                                    onKeyPress={this.onKeyPress} spellCheck="false" />
                                <TextField variant="outlined" value={this.state.password} onChange={this.handleChange.bind(this, "password")} error={this.state.loginerror}
                                    fullWidth label="비밀번호" placeholder="비밀번호를 입력해주세요." type="password" style={{height: "70px"}} inputRef={this.textFieldRef[1]}
                                    onKeyPress={this.onKeyPress}/>
                                <Box textAlign="right" fontSize={13}>
                                    <Link to="/login/password/reset" style={{textDecoration: 'none'}}><Button className={classes.accountCreateButton}>비밀번호 찾기</Button></Link>
                                    <Link to="/login/signup" style={{textDecoration: 'none'}}><Button className={classes.accountCreateButton}>계정 만들기</Button></Link>
                                </Box>
                                <Typography variant="body2" className={clsx("none", {[classes.displayNone]: this.state.cookieState === true})} style={{color: "#f44336"}}>
                                    브라우저 설정 오류입니다. 현재 사용하시는 인터넷 브라우저의 설정에 문제가 있어 로그인이 되지 않았습니다.
                                </Typography>
                            </CardContent>
                            <CardActions className={classes.loginButtonLayout}>
                                <Button onClick={this.onClickLogin} className={classes.loginButton}>
                                    로그인
                                </Button>
                            </CardActions>
                            
                        </Card >
                        
                    </Grid >


                    <Grid container justify="center">
                        <Box style={{margin: "24px 0px"}}>
                            <Box boxShadow={2} display="flex" justifyContent="center" style={{width: "450px", marginTop: "10px"}}>
                                <Button onClick={this.SNSLogin.bind(this, "google")} style={{width: "100%", borderRadius: "0px", padding: "10px"}}>
                                    <img src={googleLogo} alt="G" style={{width: "22.5px"}}/> 
                                    <Typography style={{color: "#757575", marginLeft: "10px", fontSize: "20px", fontFamily: "NotoSansKR-Medium"}}>구글 로그인</Typography>
                                </Button>
                            </Box>
                            <Box boxShadow={2} display="flex" justifyContent="center" style={{width: "450px", marginTop: "10px"}}>
                                <Button onClick={this.SNSLogin.bind(this, "kakao")} style={{width: "100%", borderRadius: "0px", padding: "10px", background: "#ffeb00"}}>
                                    <img src={kakaoLogo} alt="G" style={{width: "30px"}}/> 
                                    <Typography style={{color: "#3c1e1e", marginLeft: "10px", fontSize: "20px", fontFamily: "NotoSansKR-Medium"}}>카카오 로그인</Typography>
                                </Button>
                            </Box>
                            <Box boxShadow={2} display="flex" justifyContent="center" style={{width: "450px", marginTop: "10px"}}>
                                <Button onClick={this.SNSLogin.bind(this, "naver")} style={{width: "100%", borderRadius: "0px", padding: "10px", background: "#1ec800"}}>
                                    <img src={naverLogo} alt="G" style={{width: "30px"}}/> 
                                    <Typography style={{color: "#fff", marginLeft: "10px", fontSize: "20px", fontFamily: "NotoSansKR-Medium"}}>네이버 로그인</Typography>
                                </Button>
                            </Box>
                            <Box boxShadow={2} display="flex" justifyContent="center" style={{width: "450px", marginTop: "10px"}}>
                                <Button onClick={this.SNSLogin.bind(this, "facebook")} style={{width: "100%", borderRadius: "0px", padding: "10px", background: "#3a5daa"}}>
                                    <img src={facebookLogo} alt="G" style={{width: "25px"}}/> 
                                    <Typography style={{color: "#fff", marginLeft: "10px", fontSize: "20px", fontFamily: "NotoSansKR-Medium"}}>페이스북 로그인</Typography>
                                </Button>
                            </Box>
                        </Box>
                    </Grid>


                    <Grid container justify="center" >
                        <Box display="flex" flexDirection="row-reverse" style={{width: "450px"}}>
                            <Link to="/privacy" style={{textDecoration: 'none'}}><Button className={classes.termsButton}>개인정보처리방침</Button></Link>
                            <Link to="/terms" style={{textDecoration: 'none'}}><Button className={classes.termsButton}>이용약관</Button></Link>
                        </Box>
                    </Grid>
                    
                    <Snackbar open={this.state.loginerror || this.state.snsloginerror !== '' || this.state.toomanyerror}>
                        <Alert severity="error">
                            {this.state.loginerror? "가입하지 않은 이메일이거나, 잘못된 비밀번호입니다.":null}
                            {this.state.snsloginerror !== ''? "해당 이메일은 " + this.state.snsloginerror + " 로그인으로 가입되었습니다.":null}
                            {this.state.toomanyerror? "잠시 후 시도해주세요.":null}
                        </Alert>
                    </Snackbar>
                </div> 
            ) 
        }


        /*************************************************** 모바일 ***************************************************/
        else {
            return ( 
                <Box >
                    <Box className={classes.rootMob} >
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                        </Box>

                        <Box display="flex" justifyContent="center" style={{paddingTop: "10px"}}>
                            <Typography style={{color: "#0000008A", fontSize: "28px"}}>
                                로그인
                            </Typography>
                        </Box>

                        <TextField variant="outlined" autoFocus value={this.state.email} onChange={this.handleChange.bind(this, "email")} error={this.state.loginerror}
                                    fullWidth label="이메일" placeholder="이메일을 입력해주세요." style={{height: "70px", marginTop: "30px"}} inputRef={this.textFieldRef[0]}
                                    onKeyPress={this.onKeyPress} spellCheck="false"/>
                        <TextField variant="outlined" value={this.state.password} onChange={this.handleChange.bind(this, "password")} error={this.state.loginerror}
                            fullWidth label="비밀번호" placeholder="비밀번호를 입력해주세요." type="password" style={{height: "70px"}} inputRef={this.textFieldRef[1]}
                            onKeyPress={this.onKeyPress}/>

                        <Button onClick={this.onClickLogin} className={classes.loginButtonMob}>
                            로그인
                        </Button>

                        <Box textAlign="right">
                            <Link to="/login/signup" style={{textDecoration: 'none'}}><Button className={classes.accountCreateButton}>비밀번호 찾기</Button></Link>
                            <Link to="/login/signup" style={{textDecoration: 'none'}}><Button className={classes.accountCreateButton}>계정 만들기</Button></Link>
                        </Box>

                        
                        <Box style={{marginTop: "40px"}}>
                            <Box boxShadow={2} display="flex" justifyContent="center" style={{marginTop: "10px"}}>
                                <Button onClick={this.SNSLogin.bind(this, "google")} style={{width: "100%", borderRadius: "0px", padding: "10px"}}>
                                    <img src={googleLogo} alt="G" style={{width: "22.5px"}}/> 
                                    <Typography style={{color: "#757575", marginLeft: "10px", fontSize: "20px", fontFamily: "NotoSansKR-Medium"}}>구글 로그인</Typography>
                                </Button>
                            </Box>
                            <Box boxShadow={2} display="flex" justifyContent="center" style={{marginTop: "10px"}}>
                                <Button onClick={this.SNSLogin.bind(this, "kakao")} style={{width: "100%", borderRadius: "0px", padding: "10px", background: "#ffeb00"}}>
                                    <img src={kakaoLogo} alt="G" style={{width: "30px"}}/> 
                                    <Typography style={{color: "#3c1e1e", marginLeft: "10px", fontSize: "20px", fontFamily: "NotoSansKR-Medium"}}>카카오 로그인</Typography>
                                </Button>
                            </Box>
                            <Box boxShadow={2} display="flex" justifyContent="center" style={{marginTop: "10px"}}>
                                <Button onClick={this.SNSLogin.bind(this, "naver")} style={{width: "100%", borderRadius: "0px", padding: "10px", background: "#1ec800"}}>
                                    <img src={naverLogo} alt="G" style={{width: "30px"}}/> 
                                    <Typography style={{color: "#fff", marginLeft: "10px", fontSize: "20px", fontFamily: "NotoSansKR-Medium"}}>네이버 로그인</Typography>
                                </Button>
                            </Box>
                            <Box boxShadow={2} display="flex" justifyContent="center" style={{marginTop: "10px"}}>
                                <Button onClick={this.SNSLogin.bind(this, "facebook")} style={{width: "100%", borderRadius: "0px", padding: "10px", background: "#3a5daa"}}>
                                    <img src={facebookLogo} alt="G" style={{width: "25px"}}/> 
                                    <Typography style={{color: "#fff", marginLeft: "10px", fontSize: "20px", fontFamily: "NotoSansKR-Medium"}}>페이스북 로그인</Typography>
                                </Button>
                            </Box>
                        </Box>

                    </Box>


                    <Box textAlign="right" alignSelf="flex-end" style={{padding: "0px 40px 20px 40px"}}>
                        <Link to="/terms" style={{textDecoration: 'none'}}><Button className={classes.termsButton}>이용약관</Button></Link>
                        <Link to="/privacy" style={{textDecoration: 'none'}}><Button className={classes.termsButton}>개인정보처리방침</Button></Link>
                    </Box>

                    <Snackbar open={this.state.loginerror || this.state.snsloginerror !== '' || this.state.toomanyerror}>
                        <Alert severity="error">
                            {this.state.loginerror? "가입하지 않은 이메일이거나, 잘못된 비밀번호입니다.":null}
                            {this.state.snsloginerror !== ''? "해당 이메일은 " + this.state.snsloginerror + " 로그인으로 가입되었습니다.":null}
                            {this.state.toomanyerror? "잠시 후 시도해주세요.":null}
                        </Alert>
                    </Snackbar>
                </Box> 
            ) 
        }
        
    }
}
export default withStyles(useStyles)(withWidth()(Login));
