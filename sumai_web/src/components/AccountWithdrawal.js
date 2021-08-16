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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { logoutRequest } from '../actions/authentication';
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
    withdrawalCheckBox: {
        color: "#757575",
        fontFamily: "NotoSansKR-Light",
    },
});


function PasswordChangeMassage(props) {
    const { enqueueSnackbar } = useSnackbar();
    const { code, setCode } = props;
    const site = root.site;

    React.useEffect(() => {
        if (code === 1) enqueueSnackbar('회원탈퇴 되었습니다. 이용해주셔서 감사합니다.', { variant: "success" });
        if (code === 2) enqueueSnackbar('해당 계정이 존재하지 않습니다.', { variant: "error" });
        if (code === 3) enqueueSnackbar('비밀번호가 틀립니다.', { variant: "error" });
        if (code === 4) enqueueSnackbar('로그인 상태가 아닙니다.', { variant: "error" });
        if (code === 5) enqueueSnackbar({ site } + ' 해당 계정의 모든 데이터 삭제에 동의해주시면 회원탈퇴가 가능합니다.', { variant: "error" });
        setCode(0);
    }, [code, enqueueSnackbar, setCode])

    return (<React.Fragment></React.Fragment>);
}


class AccountPassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            password: "",
            passwordError: false,
            withdrawalChecked: false,
            dialogOpen: false,
            code: 0,
            isLoading: false,
            account: null
        }
        this.textFieldRef = [React.createRef()]
    }

    async componentDidMount() {
        const account = await this.loadAccount();
        
        this.setState({
            account: account
        })
        
    }
    
    loadAccount = async () => {
        try {
            const data = await axios.post('/api/account/accountLoad', {})
            return data.data;
        } catch (e) {
            this.props.history.push("/") 
        }
    }

    handleClickOpen = () => {
        this.setState({
            dialogOpen: true,
        })
    };

    handleClose = () => {
        this.setState({
            dialogOpen: false,
            password: "",
        })
    };

    handleCode = (code) => {
        this.setState({
            code: code
        })
    }

    handleChange = (e) => {
        this.setState({
            password: e.target.value.trim(),
            passwordError: false,
        })
    }

    handleChangeWithdrawal = (e) => {
        this.setState({ withdrawalChecked: e.target.checked })
    }

    onClickPasswordCheck = () => {
        if (this.state.account.type !== "SUMAI") {
            if (this.state.password === "삭제") {
                this.setState({
                    dialogOpen: true,
                    isLoading: false,
                })  
            } else {
                this.setState({
                    passwordError: true,
                    isLoading: false,
                })
            }
            return
        }
        
        if(this.state.password === "") {
            this.textFieldRef[0].current.focus()
            return
        }

        if (this.state.isLoading) return
        this.setState({ isLoading: true })
        this.onPasswordCheck(this.props.status.currentEmail, this.state.password).then(data => {
            if (data.success) {
                this.setState({
                    dialogOpen: true,
                    isLoading: false,
                })
            } else {
                this.setState({
                    code: data.code,
                    passwordError: true,
                    isLoading: false,
                })
            }
        })
    }
    onPasswordCheck = (email, password) => {
        return axios.post('/api/account/login', { email, password }).then(
            () => {
                if (this.props.status.isLoggedIn === true) {
                    return { success: true };
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


    onClickWithdrawal = () => {
        if (this.state.password === "") {
            this.setState({ code: 3 })
            return
        }

        if (this.state.code === 1) {
            return
        }

        if (this.state.withdrawalChecked === false) {
            this.setState({ code: 5 })
            return
        }

        if (this.state.isLoading) return
        this.setState({ isLoading: true })
        this.onWithdrawal(this.props.status.currentId, this.state.password).then(data => {
            if (data.success) {
                this.setState({
                    code: 1,
                    dialogOpen: false,
                })

                this.props.logoutRequest().then(
                    () => {
                        let domainIndex = window.location.hostname.indexOf('.') // ex) asdf.good.com -> 5 (.의 위치)
                        let domainName
                        if (domainIndex === -1) domainName = window.location.hostname // .을 못 찾은 경우 그대로 씀 -> localhost
                        else domainName = window.location.hostname.substr(domainIndex) // .이 있는 경우 -> .good.com

                        // EMPTIES THE SESSION
                        let loginData = {
                            isLoggedIn: false,
                            email: ''
                        };
                        document.cookie = 'key=' + btoa(JSON.stringify(loginData)) + ';domain=' + domainName + ';path=/;';
                    }
                );

                setTimeout(function () {
                    this.props.history.push("/login")
                }.bind(this), 2000)

            } else {
                this.setState({
                    code: data.code,
                    password: "",
                    dialogOpen: false,
                })
            }
        })
    }
    onWithdrawal = (id, password) => {
        return axios.post('/api/account/withdrawal', { id, password }).then(
            () => {
                if (this.props.status.isLoggedIn === true) {
                    return { success: true };
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
                            <Typography style={{ color: "#0000008A", paddingLeft: "10px", fontSize: "28px" }}>계정</Typography>
                        </a>

                    </Toolbar>

                    <Box display="flex" alignItems="center" justifyContent="center" style={{ paddingTop: "20px" }}>
                        <IconButton onClick={() => this.props.history.goBack()} style={{ marginLeft: "10px" }}>
                            <ArrowBackIcon style={{ color: "#0000008A" }} />
                        </IconButton>
                        <Typography variant="h5" style={{ color: "#0000008A", paddingLeft: "10px", width: "480px", minWidth: "230px" }}>회원탈퇴</Typography>
                    </Box>
                </AppBar>

                <Box style={{ background: "#fff" }}>
                    <Grid container justify="center" style={{ padding: "24px" }}>

                        <Paper variant="outlined" style={{ width: "100%", minWidth: "200px", maxWidth: "450px", padding: "24px" }}>
                            <Typography variant="caption" style={{ fontFamily: "NotoSansKR-Regular", color: "#0000008A" }}>
                                회원탈퇴
                            </Typography>

                            { this.state.account === null || this.state.account.type === "SUMAI" ? 
                                <TextField autoFocus fullWidth variant="outlined" value={this.state.password} onChange={this.handleChange} label="비밀번호 입력" 
                                    style={{margin: "30px 0px 7.5px 0px"}} placeholder="비밀번호를 입력해주세요." type="password" error={this.state.passwordError} inputRef={this.textFieldRef[0]}
                                    helperText={this.state.passwordError ? "잘못된 비밀번호입니다. 다시 시도하거나 비밀번호 찾기를 클릭하여 재설정하세요." : false}
                                    disabled={this.state.isLoading? true : false} />
                                :
                                <TextField autoFocus fullWidth variant="outlined" value={this.state.password} onChange={this.handleChange} label="계정 삭제" 
                                    style={{margin: "30px 0px 7.5px 0px"}} placeholder="회원탈퇴하시려면 '삭제'를 입력해주세요. " type="word" error={this.state.passwordError} inputRef={this.textFieldRef[0]}
                                    helperText={this.state.passwordError ? "잘못 입력하였습니다. '삭제'를 입력해주세요." : false}
                                    disabled={this.state.isLoading? true : false} />
                            }

                            <Box display="flex" flexDirection="row-reverse" style={{ marginTop: "10px" }}>
                                <Button onClick={this.onClickPasswordCheck} disabled={this.state.isLoading ? true : false} style={{ background: root.PrimaryColor, color: "#fff" }}>
                                    회원탈퇴
                                </Button>
                                <Button style={{ color: root.PrimaryColor }} disabled={this.state.isLoading ? true : false} onClick={() => this.props.history.goBack()}>
                                    취소
                                </Button>
                            </Box>
                        </Paper>

                    </Grid>
                </Box>


                <Dialog open={this.state.dialogOpen} onClose={this.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                    <DialogTitle id="alert-dialog-title">
                        <Box display="flex" alignItems="center">
                            <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />
                            <Typography variant="h5" style={{ color: "#0000008A", paddingLeft: "10px" }}>서비스 탈퇴</Typography>
                        </Box>
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" style={{ fontFamily: "NotoSansKR-Regular" }}>
                            회원탈퇴 시 모든 정보가 삭제되며, 삭제된 정보는 복구할 수 없습니다.<br />
                            정말 회원탈퇴를 진행하시겠습니까?
                        </DialogContentText>
                        <FormControlLabel label={root.site + " 계정 모든 데이터 삭제에 동의합니다."} className={classes.withdrawalCheckBox} control={<Checkbox checked={this.state.withdrawalChecked} onChange={this.handleChangeWithdrawal} disabled={this.state.isLoading ? true : false} size="medium" value="withdrawalChecked" color="primary" />} />
                    </DialogContent>


                    <DialogActions>
                        <Button onClick={this.handleClose} disabled={this.state.isLoading ? true : false} color="primary">취소</Button>
                        <Button onClick={this.onClickWithdrawal} disabled={this.state.isLoading ? true : false} color="primary">회원탈퇴</Button>
                    </DialogActions>
                </Dialog>


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

const mapDispatchToProps = (dispatch) => {
    return {
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(withRouter(AccountPassword)));
