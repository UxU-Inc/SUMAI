import React from 'react';
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import axios from 'axios';
import { SnackbarProvider, useSnackbar } from 'notistack';

import { checkSite } from '../functions/CheckSite';
const root = checkSite();


const useStyles = theme => ({
    AppBarStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
    },
    imgLogo: {
        width: root.logoWidth,
        height: root.logoHeight,
        alt: root.site,
    },
    link: {
        display: 'flex',
        alignItems: "center",
        textDecoration: 'none',
    },
    displayNone: {
        display: "none",
    },
});


function PasswordChangeMassage(props) {
    const { enqueueSnackbar } = useSnackbar()
    const { code, setCode } = props

    React.useEffect(() => {
        if (code === 1) enqueueSnackbar('비밀번호가 변경되었습니다.', { variant: "success" })
        if (code === 2) enqueueSnackbar('해당 계정이 존재하지 않습니다.', { variant: "error" })
        if (code === 3) enqueueSnackbar('현재 비밀번호가 틀립니다.', { variant: "error" })
        if (code === 4) enqueueSnackbar('로그인 상태가 아닙니다.', { variant: "error" })
        if (code === 5) enqueueSnackbar('현재 비밀번호랑 동일합니다. 다른 비밀번호로 설정해주세요.', { variant: "error" })
        if (code !== 1) setCode(0)
    }, [code, enqueueSnackbar, setCode])

    return (<React.Fragment></React.Fragment>)
}


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
            code: 0,
            isLoading: false,
        }
        this.textFieldRef = [React.createRef(), React.createRef(), React.createRef()]
    }

    componentDidUpdate() {
        if (this.props.status.loaded) {
            if (this.props.status.isLoggedIn === false) {
                setTimeout(function () {
                    this.props.history.push("/")
                }.bind(this), 0)
            }
        }
    }

    handleCode = (code) => {
        this.setState({
            code: code
        })
    }

    handleChange = (type, e) => {
        if (type === "passwordCurrent") {
            this.setState({
                passwordCurrent: e.target.value.trim(),
                passwordCurrentError: false,
            })
        } else if (type === "passwordChange") {
            this.setState({
                passwordChange: e.target.value.trim(),
            })
        } else if (type === "passwordCheck") {
            this.setState({
                passwordCheck: e.target.value.trim(),
                passwordCheckError: false,
            })
        }
        this.validation(type, e.target.value.trim())
    }

    validation = (type, value) => {
        if (type === "passwordChange") {
            // 비밀번호 유형 검사 (영어, 숫자 8~15자리)
            const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[`~!@#$%^&+*()\-_+=.,<>/?'";:[\]{}\\|]).*$/;
            if (!passwordRegex.test(value) && value !== "") {
                this.setState({
                    passwordChangeError: true,
                })
            } else {
                this.setState({
                    passwordChangeError: false,
                })
            }
        }
    }

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onClickSave();
        }
    }

    onClickSave = () => {
        if (this.state.passwordCurrent === "" || this.state.passwordCurrentError) {
            this.textFieldRef[0].current.focus()
            return
        } else if (this.state.passwordChange === "" || this.state.passwordChangeError) {
            this.textFieldRef[1].current.focus()
            return
        } else if (this.state.passwordChange !== this.state.passwordCheck) {
            this.setState({
                passwordCheck: '',
                passwordCheckError: true,
            })
            this.textFieldRef[2].current.focus()
            return
        } else if (this.state.passwordCurrent === this.state.passwordChange) {
            this.setState({
                passwordChangeError: true,
                code: 5,
            })
            this.textFieldRef[1].current.focus()
            return
        }

        if (!this.state.passwordCurrentError && !this.state.passwordChangeError && !this.state.passwordCheckError) {
            if (this.state.isLoading) return
            this.setState({ isLoading: true })
            this.onPasswordChange(this.props.status.currentId, this.state.passwordCurrent, this.state.passwordChange).then(data => {
                if (data.success) {
                    this.setState({
                        code: data.code
                    })
                    setTimeout(function () {
                        this.props.history.goBack()
                    }.bind(this), 2000)
                } else {
                    if (data.code === 3) {
                        this.setState({
                            passwordCurrentError: true,
                            code: data.code
                        })
                    } else {
                        this.setState({
                            code: data.code
                        })
                    }
                }
            })
        }
    }

    onPasswordChange = (id, passwordCurrent, passwordChange) => {
        return axios.post('/api/account/passwordChange', { id, passwordCurrent, passwordChange }).then(
            () => {
                if (this.props.status.isLoggedIn === true) {
                    return { success: true, code: 1 };
                } else {
                    return { success: false, code: 4 }
                }
            }
        ).catch(
            (error) => {
                this.setState({ isLoading: false })
                return { success: false, code: error.response.data.code }
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
                            <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />
                            <Typography style={{ color: "#0000008A", paddingLeft: "10px", fontSize: "28px", minWidth: "60px" }}>계정</Typography>
                        </a>

                    </Toolbar>

                    <Box display="flex" alignItems="center" justifyContent="center" style={{ paddingTop: "20px" }}>
                        <IconButton onClick={() => this.props.history.goBack()} style={{ marginLeft: "10px" }}>
                            <ArrowBackIcon style={{ color: "#0000008A" }} />
                        </IconButton>
                        <Typography variant="h5" style={{ color: "#0000008A", paddingLeft: "10px", width: "480px", minWidth: "230px" }}>비밀번호</Typography>
                    </Box>
                </AppBar>

                <Box style={{ background: "#fff" }}>
                    <Grid container justify="center" style={{ padding: "24px" }}>

                        <Paper variant="outlined" style={{ width: "100%", minWidth: "200px", maxWidth: "450px", padding: "24px" }}>
                            <Typography variant="caption" style={{ fontFamily: "NotoSansKR-Regular", color: "#0000008A" }}>
                                비밀번호 변경
                            </Typography>

                            <TextField autoFocus fullWidth variant="outlined" value={this.state.password} onChange={this.handleChange.bind(this, "passwordCurrent")} label="현재 비밀번호 입력"
                                style={{ margin: "30px 0px 7.5px 0px" }} type="password" error={this.state.passwordCurrentError} inputRef={this.textFieldRef[0]}
                                helperText={this.state.passwordCurrentError ? "잘못된 비밀번호입니다. 다시 시도하거나 비밀번호 찾기를 클릭하여 재설정하세요." : false} onKeyPress={this.onKeyPress}
                                disabled={this.state.code === 1 ? true : false} />

                            <TextField variant="outlined" value={this.state.password} onChange={this.handleChange.bind(this, "passwordChange")} error={this.state.passwordChangeError}
                                fullWidth label="변경할 비밀번호 입력" type="password" style={{ margin: "30px 0px 7.5px 0px" }} inputRef={this.textFieldRef[1]}
                                helperText={this.state.passwordChangeError ? "영어, 숫자, 특수문자 포함, 8~15자리" : false} onKeyPress={this.onKeyPress}
                                disabled={this.state.code === 1 ? true : false} />
                            <TextField variant="outlined" value={this.state.passwordCheck} onChange={this.handleChange.bind(this, "passwordCheck")} error={this.state.passwordCheckError}
                                fullWidth label="비밀번호 확인" type="password" style={{ margin: "7.5px 0px 15px 0px" }} inputRef={this.textFieldRef[2]}
                                helperText={this.state.passwordCheckError ? "비밀번호가 다릅니다." : false} onKeyPress={this.onKeyPress}
                                disabled={this.state.code === 1 ? true : false} />

                            <Box display="flex" flexDirection="row-reverse" mt={5}>
                                <Button onClick={this.onClickSave} disabled={this.state.code === 1 ? true : false} style={{ background: root.PrimaryColor, color: "#fff" }}>
                                    저장
                                </Button>
                                <Button onClick={() => this.props.history.goBack()} disabled={this.state.code === 1 ? true : false} style={{ color: root.PrimaryColor, marginRight: "20px" }} >
                                    취소
                                </Button>
                            </Box>
                        </Paper>

                    </Grid>
                </Box>

                <SnackbarProvider maxSnack={3}>
                    <PasswordChangeMassage code={this.state.code} setCode={this.handleCode} />
                </SnackbarProvider>

            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
    };
};

export default connect(mapStateToProps, null)(withStyles(useStyles)(withRouter(AccountPassword)));
