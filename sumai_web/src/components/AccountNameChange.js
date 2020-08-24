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
            currentName: "test",
            changeName: "test",
            nameerror: false,
        }
    }

    handleChangeName = (e) => {
        this.setState({
            changeName: e.target.value,
        })

        this.validation(e.target.value.trim())
    }

    validation = (value) => {
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
    }

    onClickSave = () => {
        if(!this.state.nameerror) {
            this.props.onNameChange(this.state.email, this.state.currentName, this.state.changeName, this.state.password).then(data => {
                if (data.success) {
                    this.props.history.goBack()
                }
            })
        }
    }


    render() {
        const { classes } = this.props;

        return (
            <div >
                <AppBar position="static" className={classes.AppBarStyle}>
                    <Toolbar variant="dense">

                        <a href="/account" className={classes.link} >
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                            <Typography style={{color: "#0000008A", paddingLeft: "10px", fontSize: "28px"}}>계정</Typography>
                        </a>

                    </Toolbar>

                    <Box display="flex" alignItems="center" justifyContent="center" style={{paddingTop: "20px"}}>
                        <IconButton onClick={() => this.props.history.goBack()}>
                            <ArrowBackIcon style={{color: "#0000008A"}}/>  
                        </IconButton>
                        <Typography variant="h5" style={{color: "#0000008A", paddingLeft: "10px", width: "600px"}}>이름</Typography>
                    </Box>
                </AppBar> 

                <Box style={{background: "#fff"}}>
                    <Grid container justify="center" style={{paddingTop: "24px"}}>

                        <Paper variant="outlined" style={{minWidth: "400px", maxWidth: "800px", padding: "24px"}}>
                            <Typography variant="caption" style={{fontFamily: "NotoSansKR-Regular", color: "#0000008A"}}>
                                이름 변경
                            </Typography>

                            <TextField autoFocus fullWidth variant="outlined" value={this.state.changeName} onChange={this.handleChangeName} label="이름" 
                                        style={{width: "100%", margin: "30px 0px 7.5px 0px"}} spellCheck="false" error={this.state.nameerror}
                                        helperText={this.state.nameerror ? "한글 또는 영어 2~10자리를 입력해주세요." : false} />

                            <Box display="flex" flexDirection="row-reverse" style={{marginTop: "10px"}}>
                                <Button  style={{background: root.PrimaryColor, color: "#fff"}}>
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


export default withStyles(useStyles)(withRouter(AccountNameChange));
