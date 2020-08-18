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
import Box from '@material-ui/core/Box';
import axios from 'axios';
import imgLogo from '../images/sumai_logo_blue.png';
import Typography from '@material-ui/core/Typography';

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
        background: '#2196f3',
        "&:hover": {
          background: "#42a5f5"
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

class Login extends Component{ 
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            emailerror: false,
            password: "",
            passworderror: false,
        }
        this.textFieldRef = [React.createRef(), React.createRef()]
    }

    handleChange = (type, e) => {
        if(type === "email") {
            this.setState({
                email: e.target.value.trim(),
                emailerror: false,
            })
        } else if (type === "password") {
            this.setState({
                password: e.target.value.trim(),
                passworderror: false,
            })
        }
    }
    snackBarHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    }
    onClickLogin = () => {
        if(this.state.email === "" || this.state.emailerror) {
            this.textFieldRef[0].current.focus()
        } else if(this.state.password === "" || this.state.passworderror) {
            this.textFieldRef[1].current.focus()
        } else {
            this.props.onLogin(this.state.email, this.state.password).then(data => {
                if (data.success) {
                    
                } else {
                    if(data.error === 2) {
                        this.textFieldRef[0].current.focus()
                        this.setState({
                            emailerror: true,
                        })
                    } else {
                        this.textFieldRef[1].current.focus()
                        this.setState({
                            password: "",
                            passworderror: true,
                        })
                    }
                }
            })
            
        }
    }
    onKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.onClickLogin();
        }
    }
    onClickGoogle = async() => {
        const res = await axios.get('/api/login/google')
        console.log(res.data)
    }
    render() { 
        const { classes } = this.props;
        return ( 
            <div className={classes.root} >
                <Grid container justify="center" spacing={1}>
                    <Card elevation={3} style={{minWidth: "250px",maxWidth: "450px"}}>
                        <CardHeader className={classes.cardTitleText}
                                    title={
                                            <Box display="flex" alignItems="center">
                                                <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 

                                                <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px"}}>
                                                    로그인
                                                </Typography>
                                            </Box>
                                        }  
                        />
                        <CardContent style={{padding: "16px 10%"}}>
                            <TextField variant="outlined" autoFocus value={this.state.email} onChange={this.handleChange.bind(this, "email")} error={this.state.emailerror || this.state.signupEmailExist}
                                fullWidth label="이메일" placeholder="이메일을 입력해주세요." style={{height: "70px", marginTop: "15px", fontFamily: "NotoSansKR-Thin"}} inputRef={this.textFieldRef[0]}
                                onKeyPress={this.onKeyPress}/>
                            <TextField variant="outlined" value={this.state.password} onChange={this.handleChange.bind(this, "password")} error={this.state.passworderror}
                                fullWidth label="비밀번호" placeholder="비밀번호를 입력해주세요." type="password" style={{height: "70px"}} inputRef={this.textFieldRef[1]}
                                onKeyPress={this.onKeyPress}/>
                            <Box textAlign="right" fontSize={13}>
                                <Button onClick={this.props.startSignupFunction} size="small" color="primary" style={{padding: "0px"}}>계정 만들기</Button>
                            </Box>
                        </CardContent>
                        <CardActions className={classes.loginButtonLayout}>
                            <Button onClick={this.onClickLogin} className={classes.loginButton}>
                                로그인
                            </Button>
                        </CardActions>
                        
                    </Card >
                </Grid >
                <Snackbar open={this.state.emailerror || this.state.passworderror}>
                    <Alert severity="error">
                        {this.state.emailerror? "SUMAI 계정을 찾을 수 없습니다.":null}
                        {this.state.passworderror? "비밀번호가 틀렸습니다.":null}
                    </Alert>
                </Snackbar>
            </div> 
        ) 
    }
}
export default withStyles(useStyles)(Login);
