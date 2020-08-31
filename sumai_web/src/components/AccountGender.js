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
import * as root from '../rootValue';
import { connect } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
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
        textDecoration: 'none'
    },
    displayNone: {
      display: "none",
    },
});


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class AccountNameChange extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: this.props.status.currentEmail,
            genderCurrent: this.props.gender,
            genderCustom: '',
            genderError: 0,
        }
        this.textFieldRef = [React.createRef()]
    }

    // componentDidMount() {
    //     if(this.props.status.isLoggedIn === false) {
    //         this.props.history.push("/")
    //     } 
    // }

    handleClose = () => {
        this.setState({ genderError: 0 })
    }

    handleChangeGender = (e) => {
        this.setState({
            genderCurrent: e.target.value,
            genderError: 1,
        })
    }

    handleChangeGenderCustom = (e) => {
        this.setState({
            genderCustom: e.target.value,
        })
    }

    validation = () => {

        if(this.state.genderCurrent === "" || this.state.genderCurrent === undefined) {
            this.setState({ genderError: -1 })
            return
        } 
        
        if(this.state.genderCurrent === "사용자 지정" && this.state.genderCustom === "") {
            this.textFieldRef[0].current.focus()
            this.setState({ genderError: -2 })
            return
        } 
        
        if(this.state.genderCurrent !== "" && this.state.genderCurrent !== "사용자 지정") {
            this.onGenderChange(this.state.email, this.state.genderCurrent).then(data => {
                if (data.success) {
                    this.props.history.goBack()
                }
            })
            return
        }

        if(this.state.genderCurrent === "사용자 지정" && this.state.genderCustom !== "") {
            this.onGenderChange(this.state.email, this.state.genderCustom).then(data => {
                if (data.success) {
                    this.props.history.goBack()
                }
            })
            return
        }

    }

    onClickSave = () => {
        this.validation()
    }

    onGenderChange = (email, gender) => {
        return axios.post('/api/account/genderChange', { email, gender }).then(
            () => {
                if(this.props.status.isLoggedIn === true) {
                    return { success: true };
                } else {
                    return { success: false }
                }
            }
        ).catch(
            (error) => {
                return { success: false }
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
                            <Typography style={{color: "#0000008A", paddingLeft: "10px", fontSize: "28px", minWidth: "60px"}}>계정</Typography>
                        </a>

                    </Toolbar>

                    <Box display="flex" alignItems="center" justifyContent="center" style={{paddingTop: "20px"}}>
                        <IconButton onClick={() => this.props.history.goBack()}>
                            <ArrowBackIcon style={{color: "#0000008A", paddingLeft: "12px"}}/>  
                        </IconButton>
                        <Typography variant="h5" style={{color: "#0000008A", paddingLeft: "10px", width: "480px", minWidth: "230px"}}>성별</Typography>
                    </Box>
                </AppBar> 

                <Box style={{background: "#fff"}}>
                    <Grid container justify="center" style={{padding: "24px"}}>

                        <Paper variant="outlined" style={{width: "100%", minWidth: "200px", maxWidth: "450px", padding: "24px"}}>
                            <FormControl component="fieldset" >
                                <Typography variant="caption" style={{fontFamily: "NotoSansKR-Regular", color: "#0000008A"}}>
                                    성별
                                </Typography>

                                <RadioGroup style={{color: "#0000008A", padding: "20px 20px 0px 20px"}} aria-label="gender" name="gender" value={this.state.genderCurrent || ''} onChange={this.handleChangeGender}>
                                    <FormControlLabel value="여성" control={<Radio color="primary"/>} label="여성" />
                                    <FormControlLabel value="남성" control={<Radio color="primary"/>} label="남성" />
                                    <FormControlLabel value="공개 안함" control={<Radio color="primary"/>} label="공개 안함" />
                                    <FormControlLabel value="사용자 지정" control={<Radio color="primary"/>} label="사용자 지정" />
                                </RadioGroup>

                                <Box style={{minWidth: "150px", margin: "5px 20px 0px 20px"}}>
                                    <TextField fullWidth variant="outlined" value={this.state.genderCustom || ''} label="성별 입력" style={{width: "100%"}} onChange={this.handleChangeGenderCustom}
                                        className={clsx("none", {[classes.displayNone]: this.state.genderCurrent !== "사용자 지정"})}
                                        error={this.state.genderError === -2} inputRef={this.textFieldRef[0]}
                                        helperText={this.state.genderError === -2 ? "사용자 지정 성별을 입력해주세요." : false} />
                                </Box>
                            </FormControl>
                                
                            <Box display="flex" flexDirection="row-reverse" mt={5}>
                                <Button onClick={this.onClickSave} style={{background: root.PrimaryColor, color: "#fff"}}>
                                    저장
                                </Button>
                                <Button style={{color: root.PrimaryColor, marginRight: "20px"}} onClick={() => this.props.history.goBack()}>
                                    취소
                                </Button>
                            </Box>
                        </Paper>

                    </Grid>
                </Box>

                <Snackbar autoHideDuration={3000} open={this.state.genderError === -1} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="error">
                        {"성별을 선택해주세요."}
                    </Alert>
                </Snackbar>
                  
            </div>
          );
    }

}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
    };
};

export default connect(mapStateToProps, null)(withStyles(useStyles)(withRouter(AccountNameChange)));
