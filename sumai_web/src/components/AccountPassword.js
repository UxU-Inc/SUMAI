import React from 'react';
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import imgLogo from '../images/sumai_logo_blue.png';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as root from '../rootValue';
import { connect } from 'react-redux';
import axios from 'axios';

const useStyles = theme => ({
    AppBarStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
    },
    imgLogo: {
        width: 80,
        height: 28.2,
        alt: 'SUMAI',
    },
    link: {
        display: 'flex',
        alignItems: "center",
        textDecoration: 'none',
    },
});


class AccountPassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            passwordCurrent: "",
            passwordCurrentError: false,
            passwordChange: "",
            passwordChangeError: false,
            passwordCheck: "",
            passwordCheckError: false,
            massage: "",
        }
        this.textFieldRef = [React.createRef(), React.createRef(), React.createRef()]
    }

    handleChange = (type, e) => {
        if(type === "passwordCurrent") {
            this.setState({
                passwordCurrent: e.target.value.trim(),
            })
        } else if (type === "passwordChange") {
            this.setState({
                passwordChange: e.target.value.trim(),
            })
        } else if (type === "passwordCheck") {
            this.setState({
                passwordCheck: e.target.value.trim(),
            })
        }
        this.validation(type, e.target.value.trim())
    }

    validation = (type, value) => {
        if (type === "passwordChange") {
            // 비밀번호 유형 검사 (영어, 숫자 8~15자리)
            const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[`~!@#$%^&+*()\-_+=.,<>/?'";:[\]{}\\|]).*$/;
            if(!passwordRegex.test(value) && value !== "") {
                this.setState({
                    passwordChangeError: true,
                })
            } else {
                this.setState({
                    passwordChangeError: false,
                })
            }
        } else if (type === "passwordCheck") {
            // 비밀번호 확인
            if((this.state.passwordChangeError || this.state.passwordChange !== value) && value !== "") {
                this.setState({
                    passwordCheckError: true,
                })
            } else {
                this.setState({
                    passwordCheckError: false,
                })
            }
        } 
    }

    onClickSave = () => {
        if(this.state.passwordCurrent === "" || this.state.passwordCurrentError) {
            this.textFieldRef[0].current.focus()
            return
        } else if(this.state.passwordChange === "" || this.state.passwordChangeError) {
            this.textFieldRef[1].current.focus()
            return
        } else if(this.state.passwordCheck === "" || this.state.passwordCheckError) {
            this.textFieldRef[2].current.focus()
            return
        }

        if(!this.state.passwordCurrentError && !this.state.passwordChangeError && !this.state.passwordCheckError) {
            this.onPasswordChange(this.props.status.currentEmail, this.state.passwordCurrent, this.state.passwordChange).then(data => {
                if (data.success) {
                    this.props.history.goBack()
                } else {
                    this.setState({
                        massage: data.massage
                    })
                    console.log(this.state.massage)
                }
            })
        }
    }

    onPasswordChange = (email, passwordCurrent, passwordChange) => {
        return axios.post('/api/account/passwordChange', { email, passwordCurrent, passwordChange }).then(
            () => {
                if(this.props.status.isLoggedIn === true) {
                    return { success: true };
                } else {
                    console.log(this.props.status.isLoggedIn)
                    return { success: false, massage: "로그인 상태가 아닙니다." }
                }
            }
        ).catch(
            (error) => {
                return { success: false, massage: error.response.data.error }
            }
        );
    }


    render() {
        const { classes } = this.props;

        return (
            <div >
                <AppBar position="static" className={classes.AppBarStyle}>
                    <Toolbar variant="dense">

                        <a href="/accounts" className={classes.link} >
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                            <Typography style={{color: "#0000008A", paddingLeft: "10px", fontSize: "28px"}}>계정</Typography>
                        </a>

                    </Toolbar>

                    <Box display="flex" alignItems="center" justifyContent="center" style={{paddingTop: "20px"}}>
                        <IconButton onClick={() => this.props.history.goBack()}>
                            <ArrowBackIcon style={{color: "#0000008A"}}/>  
                        </IconButton>
                        <Typography variant="h5" style={{color: "#0000008A", paddingLeft: "10px", width: "600px"}}>비밀번호</Typography>
                    </Box>
                </AppBar> 

                <Box style={{background: "#fff"}}>
                    <Grid container justify="center" style={{padding: "24px"}}>

                        <Paper variant="outlined" style={{width: "100%", minWidth: "200px", maxWidth: "450px", padding: "24px"}}>
                            <Typography variant="caption" style={{fontFamily: "NotoSansKR-Regular", color: "#0000008A"}}>
                                비밀번호 변경
                            </Typography>

                            <TextField autoFocus fullWidth variant="outlined" value={this.state.password} onChange={this.handleChange.bind(this, "passwordCurrent")} label="현재 비밀번호 입력" 
                                        style={{margin: "30px 0px 7.5px 0px"}} placeholder="현재 비밀번호를 입력해주세요." type="password" error={this.state.passwordCurrentError} inputRef={this.textFieldRef[0]}
                                        helperText={this.state.passwordCurrentError ? "잘못된 비밀번호입니다. 다시 시도하거나 비밀번호 찾기를 클릭하여 재설정하세요." : false} />

                            <TextField variant="outlined" value={this.state.password} onChange={this.handleChange.bind(this, "passwordChange")} error={this.state.passwordChangeError}
                                    fullWidth label="변경할 비밀번호 입력" placeholder="변경할 비밀번호를 입력해주세요." type="password" style={{margin: "30px 0px 7.5px 0px"}} inputRef={this.textFieldRef[1]}
                                    helperText={this.state.passwordChangeError? "영어, 숫자, 특수문자 포함, 8~15자리": false} onKeyPress={this.onKeyPress}/>
                            <TextField variant="outlined" value={this.state.passwordcheck} onChange={this.handleChange.bind(this, "passwordCheck")} error={this.state.passwordCheckError}
                                    fullWidth label="비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해주세요." type="password" style={{margin: "7.5px 0px 15px 0px"}} inputRef={this.textFieldRef[2]}
                                    helperText={this.state.passwordCheckError? "비밀번호가 다릅니다.": false} onKeyPress={this.onKeyPress}/>

                            <Box display="flex" flexDirection="row-reverse" style={{marginTop: "10px"}}>
                                <Button onClick={this.onClickSave} style={{background: root.PrimaryColor, color: "#fff"}}>
                                    저장
                                </Button>
                                <Button style={{color: root.PrimaryColor}} onClick={() => this.props.history.goBack()}>
                                    취소
                                </Button>
                            </Box>
                        </Paper>

                    </Grid>
                </Box>


                  
            </div>
          );
    }

}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
        loginStatus: state.authentication.login.status,
        loginErrorCode: state.authentication.login.error,
    };
};

export default connect(mapStateToProps, null)(withStyles(useStyles)(withRouter(AccountPassword)));
