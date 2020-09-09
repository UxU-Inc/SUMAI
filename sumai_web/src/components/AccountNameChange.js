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
import { nameChangeRequest } from '../actions/authentication';

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
        textDecoration: 'none'
    },
});


class AccountNameChange extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: this.props.status.currentId,
            email: this.props.status.currentEmail,
            nameCurrent: this.props.status.currentUser,
            nameChange: this.props.status.currentUser,
            nameError: false,
            isLoading: false,
        }
        this.textFieldRef = [React.createRef()]
    }

    componentDidUpdate() {
        if(this.props.status.loaded) {
            if(this.props.status.isLoggedIn === false) {
                setTimeout(function() { 
                    this.props.history.push("/") 
                }.bind(this), 0)
            } 
        }
        if(this.props.status.isLoggedIn && this.state.nameCurrent === '' && typeof this.props.status.currentUser !== "undefined") {
            this.setState({
                nameCurrent: this.props.status.currentUser,
                nameChange: this.props.status.currentUser,
            }) 
        }
    }

    handleChangeName = (e) => {
        this.setState({
            nameChange: e.target.value,
        })

        this.validation(e.target.value.trim())
    }

    validation = (value) => {
        const nameRegex = /^[a-zA-Z가-힣0-9]{2,10}$/;
        if(!nameRegex.test(value) && value !== "") {
            this.setState({
                nameError: true,
            })
        } else {
            this.setState({
                nameError: false,
            })
        } 
    }

    onClickSave = () => {
        if(this.state.nameChange === "" || this.state.nameError || this.state.nameCurrent === this.state.nameChange) {
            this.textFieldRef[0].current.focus()
            return
        }

        if(this.state.id !== "" && !this.state.nameError) {
            if(this.state.isLoading) return
            this.setState({ isLoading: true })
            this.onNameChange(this.state.id, this.state.email, this.state.nameChange).then(data => {
                if (data.success) {
                    this.props.history.goBack()
                }
            })
        }
    }

    onNameChange = (id, email, nameChange) => {
        return this.props.nameChangeRequest(id, email, nameChange).then(
            () => {
                if(this.props.status.currentUser !== "") {
                    return { success: true }
                } else {
                    return { success: false }
                }
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }


    render() {
        const { classes } = this.props;

        return (
            <div >
                <AppBar position="static" className={classes.AppBarStyle}>
                    <Toolbar variant="dense">

                        <a href="/accounts" className={classes.link} >
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                            <Typography style={{color: "#0000008A", paddingLeft: "10px", fontSize: "28px", minWidth: "60px"}}>계정</Typography>
                        </a>

                    </Toolbar>

                    <Box display="flex" alignItems="center" justifyContent="center" style={{paddingTop: "20px"}}>
                        <IconButton onClick={() => this.props.history.goBack()} style={{marginLeft: "10px"}}>
                            <ArrowBackIcon style={{color: "#0000008A"}}/>  
                        </IconButton>
                        <Typography variant="h5" style={{color: "#0000008A", paddingLeft: "10px", width: "480px", minWidth: "230px"}}>이름</Typography>
                    </Box>
                </AppBar> 

                <Box style={{background: "#fff"}}>
                    <Grid container justify="center" style={{padding: "24px"}}>

                        <Paper variant="outlined" style={{width: "100%", minWidth: "200px", maxWidth: "450px", padding: "24px"}}>
                            <Typography variant="caption" style={{fontFamily: "NotoSansKR-Regular", color: "#0000008A"}}>
                                이름 변경
                            </Typography>

                            <TextField autoFocus fullWidth variant="outlined" value={this.state.nameChange || ""} onChange={this.handleChangeName} label={"이름"} 
                                        style={{width: "100%", margin: "30px 0px 7.5px 0px"}} spellCheck="false" error={this.state.nameError} inputRef={this.textFieldRef[0]}
                                        helperText={this.state.nameError ? "한글 또는 영어 2~10자리를 입력해주세요." : false} 
                                        disabled={this.state.isLoading? true : false} />

                            <Box display="flex" flexDirection="row-reverse" mt={5}>
                                <Button onClick={this.onClickSave} disabled={this.state.isLoading? true : false} style={{background: root.PrimaryColor, color: "#fff"}}>
                                    저장
                                </Button>
                                <Button onClick={() => this.props.history.goBack()} disabled={this.state.isLoading? true : false} style={{color: root.PrimaryColor, marginRight: "20px"}}>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        nameChangeRequest: (id, email, name) => {
            return dispatch(nameChangeRequest(id, email, name));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(withRouter(AccountNameChange)));
