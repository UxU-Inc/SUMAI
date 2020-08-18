import React, { Component } from 'react'; 
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

const useStyles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3),
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
        background: '#21DC6D',
        "&:hover": {
          background: "#36e37c"
        },
        width: '100%',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderRadius: '0px',
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
        } 
        if(!this.state.emailerror && !this.state.nameerror && !this.state.passworderror && !this.state.passwordcheckerror) {
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
        return ( 
            <div className={classes.root} >
                <Grid container justify="center" spacing={1}>
                    <Card elevation={3} style={{minWidth: "250px",maxWidth: "600px"}}>
                        <CardHeader title="SUMAI 계정 만들기" className={classes.cardTitleText} />
                        <CardContent >
                            <TextField autoFocus value={this.state.email} onChange={this.handleChange.bind(this, "email")} error={this.state.emailerror || this.state.signupEmailExist}
                                fullWidth label="E-MAIL" placeholder="이메일을 입력해주세요." style={{height: "70px"}} inputRef={this.textFieldRef[0]}
                                helperText={this.state.emailerror? "이메일 형식이 올바르지 않습니다.": false} onKeyPress={this.onKeyPress}/>
                            <TextField value={this.state.name} onChange={this.handleChange.bind(this, "name")} error={this.state.nameerror}
                                fullWidth label="NAME" placeholder="이름을 입력해주세요." style={{height: "70px"}} inputRef={this.textFieldRef[1]}
                                helperText={this.state.nameerror? "한글, 영어만 사용, 2~10자리": false} onKeyPress={this.onKeyPress}/>
                            <TextField value={this.state.password} onChange={this.handleChange.bind(this, "password")} error={this.state.passworderror}
                                fullWidth label="PASSWORD" placeholder="비밀번호를 입력해주세요." type="password" style={{height: "70px"}} inputRef={this.textFieldRef[2]}
                                helperText={this.state.passworderror? "영어, 숫자, 특수문자 포함, 8~15자리": false} onKeyPress={this.onKeyPress}/>
                            <TextField value={this.state.passwordcheck} onChange={this.handleChange.bind(this, "passwordcheck")} error={this.state.passwordcheckerror}
                                fullWidth label="PASSWORDCHECK" placeholder="비밀번호를 한번 더 입력해주세요." type="password" style={{height: "70px"}} inputRef={this.textFieldRef[3]}
                                helperText={this.state.passwordcheckerror? "비밀번호가 다릅니다.": false} onKeyPress={this.onKeyPress}/>
                        </CardContent>
                        <CardActions className={classes.signupButtonLayout}>
                            <Button onClick={this.onClickSignup} className={classes.signupButton}>
                                회원가입
                            </Button>
                        </CardActions>
                    </Card >
                </Grid >
                <Snackbar open={this.state.signupEmailExist}>
                    <Alert severity="error">
                        해당 이메일로 가입한 계정이 존재합니다.
                    </Alert>
                </Snackbar>
            </div> 
        ) 
    } 
}

export default withStyles(useStyles)(Signup);
