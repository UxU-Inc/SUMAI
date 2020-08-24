import React, { Component } from 'react'; 
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
import { Link } from 'react-router-dom';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = theme => ({
    root: {
        padding: "10% 0px",
    },
    rootMob: {
        padding: "40px",
        height: "70vh",
    },
    cardTitleText: {
        borderBottom: '1px solid #e0e0e0',
        color: '#0000008a',
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
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
    signupButtonLayout: {
        padding: theme.spacing(0),
    },
    signupButton: {
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
    signupButtonMob: {
        margin: "20px 0px",
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
    imgLogo: {
        width: 80,
        height: 28.2,
        alt: 'SUMAI',
    },
    termsButton: {
        width: "105px",
        padding: "7.5px", 
        fontSize: "12px", 
        color: "#fff",
        fontFamily: "NotoSansKR-Light",
        background: root.PrimaryColor,
        "&:hover": {
          background: root.HoberColor,
        },
    },
    termsCheckBox: {
        color: "#757575",
        fontFamily: "NotoSansKR-Light",
    },
})

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Signup extends Component{ 
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            emailerror: false,
            name: "",
            nameerror: false,
            password: "",
            passworderror: false,
            passwordcheck: "",
            passwordcheckerror: false,
            signupEmailExist: false,
            termsChecked: false,
            termsCheckederror: false,
            privacyChecked: false,
            privacyCheckederror: false,
        }
        this.textFieldRef = [React.createRef(), React.createRef(), React.createRef(), React.createRef()]
      }

    handleChange = (type, e) => {
        if(type === "email") {
            this.setState({
                signupEmailExist: false,
                email: e.target.value.trim(),
            })
        } else if (type === "name") {
            this.setState({
                name: e.target.value.trim(),
            })
        } else if (type === "password") {
            this.setState({
                password: e.target.value.trim(),
            })
        } else if (type === "passwordcheck") {
            this.setState({
                passwordcheck: e.target.value.trim(),
            })
        } else if(type === "terms") {
            this.setState({
                termsChecked: e.target.checked,
            })
        } else if(type === "privacy") {
            this.setState({
                privacyChecked: e.target.checked,
            })
        }
        this.validation(type, e.target.value.trim())
    }
    validation = (type, value) => {
        if(type === "email") {
            // 이메일 형식 검사
            const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
            if(!emailRegex.test(value) && value !== "") {
                this.setState({
                    emailerror: true,
                })
            } else {
                this.setState({
                    emailerror: false,
                })
            }
        } else if (type === "name") {
            // 이름 형식 검사
            const nameRegex = /^[a-zA-Z가-힣]{2,10}$/;
            if(!nameRegex.test(value) && value !== "") {
                this.setState({
                    nameerror: true,
                })
            } else {
                this.setState({
                    nameerror: false,
                })
            }
        } else if (type === "password") {
            // 비밀번호 유형 검사 (영어, 숫자 8~15자리)
            const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[`~!@#$%^&+*()\-_+=.,<>/?'";:[\]{}\\|]).*$/;
            if(!passwordRegex.test(value) && value !== "") {
                this.setState({
                    passworderror: true,
                })
            } else {
                this.setState({
                    passworderror: false,
                })
            }
        } else if (type === "passwordcheck") {
            // 비밀번호 확인
            if((this.state.passworderror || this.state.password !== value) && value !== "") {
                this.setState({
                    passwordcheckerror: true,
                })
            } else {
                this.setState({
                    passwordcheckerror: false,
                })
            }
        } 
    }
    snackBarHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        if(this.state.termsCheckederror) {
            this.setState({
                termsCheckederror: false,
            })
        } else if(this.state.privacyCheckederror) {
            this.setState({
                privacyCheckederror: false,
            })
        }
    }
    onClickSignup = () => {
        if(this.state.email === "" || this.state.emailerror) {
            this.textFieldRef[0].current.focus()
            return
        } else if(this.state.name === "" || this.state.nameerror) {
            this.textFieldRef[1].current.focus()
            return
        } else if(this.state.password === "" || this.state.passworderror) {
            this.textFieldRef[2].current.focus()
            return
        } else if(this.state.passwordcheck === "" || this.state.passwordcheckerror) {
            this.textFieldRef[3].current.focus()
            return
        } else if(!this.state.termsChecked) {
            this.setState({
                termsCheckederror: true,
            })
            return
        } else if(!this.state.privacyChecked) {
            this.setState({
                privacyCheckederror: true,
            })
            return
        }
        if(!this.state.emailerror && !this.state.nameerror && !this.state.passworderror && !this.state.passwordcheckerror && !this.state.termsCheckederror && !this.state.privacyCheckederror) {
            this.props.onSignup(this.state.email, this.state.name, this.state.password).then(data => {
                if (data.success) {
                    
                } else {
                    if(data.error === 1) {
                        this.textFieldRef[0].current.focus()
                        this.setState({
                            signupEmailExist: true,
                        })
                    }
                }
            })
            
        }
    }
    onKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.onClickSignup();
        }
    }

    render(){ 
        const { classes } = this.props;

        /**************************************************** PC *****************************************************/
        if(isWidthUp('sm', this.props.width)) {
            return ( 
                <div className={classes.root}>
                    <Box display="flex" justifyContent="center">
                        <Card elevation={3} style={{minWidth: "450px",maxWidth: "450px"}} >
                            <CardHeader className={classes.cardTitleText} 
                                        title={
                                                <Box display="flex" alignItems="center">
                                                    <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 

                                                    <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px"}}>
                                                        계정 만들기
                                                    </Typography>
                                                </Box>
                                            }   
                            />
                            <CardContent style={{padding: "16px 10%"}}>
                                <TextField autoFocus variant="outlined" value={this.state.email} onChange={this.handleChange.bind(this, "email")} error={this.state.emailerror || this.state.signupEmailExist}
                                    fullWidth label="이메일" placeholder="이메일을 입력해주세요." style={{margin: "15px 0px 7.5px 0px"}} inputRef={this.textFieldRef[0]}
                                    helperText={this.state.emailerror? "이메일 형식이 올바르지 않습니다.": false} onKeyPress={this.onKeyPress} spellCheck="false"/>
                                <TextField variant="outlined" value={this.state.name} onChange={this.handleChange.bind(this, "name")} error={this.state.nameerror}
                                    fullWidth label="이름" placeholder="이름을 입력해주세요." style={{margin: "7.5px 0px"}} inputRef={this.textFieldRef[1]}
                                    helperText={this.state.nameerror? "한글, 영어만 사용, 2~10자리": false} onKeyPress={this.onKeyPress} spellCheck="false"/>
                                <TextField variant="outlined" value={this.state.password} onChange={this.handleChange.bind(this, "password")} error={this.state.passworderror}
                                    fullWidth label="비밀번호" placeholder="비밀번호를 입력해주세요." type="password" style={{margin: "7.5px 0px"}} inputRef={this.textFieldRef[2]}
                                    helperText={this.state.passworderror? "영어, 숫자, 특수문자 포함, 8~15자리": false} onKeyPress={this.onKeyPress}/>
                                <TextField variant="outlined" value={this.state.passwordcheck} onChange={this.handleChange.bind(this, "passwordcheck")} error={this.state.passwordcheckerror}
                                    fullWidth label="비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해주세요." type="password" style={{margin: "7.5px 0px 15px 0px"}} inputRef={this.textFieldRef[3]}
                                    helperText={this.state.passwordcheckerror? "비밀번호가 다릅니다.": false} onKeyPress={this.onKeyPress}/>


                                <Box display="flex" style={{marginTop: "10px"}}>
                                    <FormControlLabel label="이용약관 동의" className={classes.termsCheckBox} control={<Checkbox checked={this.state.termsChecked} onChange={this.handleChange.bind(this, "terms")} size="medium" value="termsChecked" color="primary"/>}   />
                                    <Link to="/terms" style={{textDecoration: 'none', marginLeft: "auto"}} ><Button className={classes.termsButton}>이용약관</Button></Link>
                                </Box>
                                <Box display="flex">
                                    <FormControlLabel label="개인정보처리방침 동의" className={classes.termsCheckBox} control={<Checkbox checked={this.state.privacyChecked} onChange={this.handleChange.bind(this, "privacy")} size="medium" value="privacyChecked" color="primary"/>}   />
                                    <Link to="/privacy" style={{textDecoration: 'none', marginLeft: "auto"}} ><Button className={classes.termsButton}>개인정보처리방침</Button></Link>
                                </Box>

                            </CardContent>
                            <CardActions className={classes.signupButtonLayout}>
                                <Button onClick={this.onClickSignup} className={classes.signupButton}>
                                    회원가입
                                </Button>
                            </CardActions>
                        </Card >
                    </Box >

                    <Snackbar open={this.state.signupEmailExist}>
                        <Alert severity="error">
                            해당 이메일로 가입한 계정이 존재합니다.
                        </Alert>
                    </Snackbar>

                    <Snackbar open={this.state.termsCheckederror} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
                        <Alert severity="error">
                            이용약관에 동의해주세요.
                        </Alert>
                    </Snackbar>

                    <Snackbar open={this.state.privacyCheckederror} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
                        <Alert severity="error">
                            개인정보처리방침에 동의해주세요.
                        </Alert>
                    </Snackbar>
                </div> 
            ) 
        }


        /*************************************************** 모바일 ***************************************************/
        else {
            return ( 
                <div >
                    <Box className={classes.rootMob} >

                        <Box display="flex" alignItems="center" justifyContent="center">
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                        </Box>

                        <Box display="flex" justifyContent="center" style={{paddingTop: "10px"}}>
                            <Typography style={{color: "#0000008A", fontSize: "28px"}}>
                                계정 만들기
                            </Typography>
                        </Box>

                        <TextField autoFocus variant="outlined" value={this.state.email} onChange={this.handleChange.bind(this, "email")} error={this.state.emailerror || this.state.signupEmailExist}
                            fullWidth label="이메일" placeholder="이메일을 입력해주세요." style={{margin: "30px 0px 7.5px 0px"}} inputRef={this.textFieldRef[0]}
                            helperText={this.state.emailerror? "이메일 형식이 올바르지 않습니다.": false} onKeyPress={this.onKeyPress} spellCheck="false"/>
                        <TextField variant="outlined" value={this.state.name} onChange={this.handleChange.bind(this, "name")} error={this.state.nameerror}
                            fullWidth label="이름" placeholder="이름을 입력해주세요." style={{margin: "7.5px 0px"}} inputRef={this.textFieldRef[1]}
                            helperText={this.state.nameerror? "한글, 영어만 사용, 2~10자리": false} onKeyPress={this.onKeyPress} spellCheck="false"/>
                        <TextField variant="outlined" value={this.state.password} onChange={this.handleChange.bind(this, "password")} error={this.state.passworderror}
                            fullWidth label="비밀번호" placeholder="비밀번호를 입력해주세요." type="password" style={{margin: "7.5px 0px"}} inputRef={this.textFieldRef[2]}
                            helperText={this.state.passworderror? "영어, 숫자, 특수문자 포함, 8~15자리": false} onKeyPress={this.onKeyPress}/>
                        <TextField variant="outlined" value={this.state.passwordcheck} onChange={this.handleChange.bind(this, "passwordcheck")} error={this.state.passwordcheckerror}
                            fullWidth label="비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해주세요." type="password" style={{margin: "7.5px 0px 15px 0px"}} inputRef={this.textFieldRef[3]}
                            helperText={this.state.passwordcheckerror? "비밀번호가 다릅니다.": false} onKeyPress={this.onKeyPress}/>

                        <Box display="flex" style={{marginTop: "10px"}}>
                            <FormControlLabel label="이용약관 동의" className={classes.termsCheckBox} control={<Checkbox checked={this.state.termsChecked} onChange={this.handleChange.bind(this, "terms")} size="medium" value="termsChecked" color="primary"/>}   />
                            <Link to="/terms" style={{textDecoration: 'none', marginLeft: "auto"}} ><Button className={classes.termsButton}>이용약관</Button></Link>
                        </Box>
                        <Box display="flex" >
                            <FormControlLabel label="개인정보처리방침 동의" className={classes.termsCheckBox} control={<Checkbox checked={this.state.privacyChecked} onChange={this.handleChange.bind(this, "privacy")} size="medium" value="privacyChecked" color="primary"/>}   />
                            <Link to="/privacy" style={{textDecoration: 'none', marginLeft: "auto"}} ><Button className={classes.termsButton}>개인정보처리방침</Button></Link>
                        </Box>

                        <Button onClick={this.onClickSignup} className={classes.signupButtonMob}>
                            회원가입
                        </Button>

                    </Box >

                    <Snackbar open={this.state.signupEmailExist}>
                        <Alert severity="error">
                            해당 이메일로 가입한 계정이 존재합니다.
                        </Alert>
                    </Snackbar>

                    <Snackbar open={this.state.termsCheckederror} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
                        <Alert severity="error">
                            이용약관에 동의해주세요.
                        </Alert>
                    </Snackbar>

                    <Snackbar open={this.state.privacyCheckederror} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
                        <Alert severity="error">
                            개인정보처리방침에 동의해주세요.
                        </Alert>
                    </Snackbar>
                </div> 
            ) 
        }
        
    } 
}

export default withStyles(useStyles)(withWidth()(Signup));
