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
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import * as root from '../rootValue';
import { connect } from 'react-redux';
import moment from 'moment'
import TextField from '@material-ui/core/TextField';
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
    formControl: {
        margin: "0px 15px",
        width: "100%",
        minWidth: "80px",
    },
});


class AccountNameChange extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: this.props.status.currentEmail,
            year: '',
            month: '',
            date: '',
            errorMassage: '',
        }
        this.textFieldRef = [React.createRef(), React.createRef()]
    }

    componentDidMount() {
        this.setState({
            year: moment(this.props.location.state.birthday).format('YYYY') === "Invalid date" ? "" : moment(this.props.location.state.birthday).format('YYYY'),
            month: moment(this.props.location.state.birthday).format('MM') === "Invalid date" ? "" : moment(this.props.location.state.birthday).format('MM'),
            date: moment(this.props.location.state.birthday).format('D') === "Invalid date" ? "" : moment(this.props.location.state.birthday).format('D'),
        }) 
    }

    componentDidUpdate() {
        if(this.props.status.loaded) {
            if(this.props.status.isLoggedIn === false) {
                this.props.history.push("/")
            } 
        }
    }

    componentWillReceiveProps() {
        setTimeout(function() { 
            this.setState({
                year: moment(this.props.location.state.birthday).format('YYYY') === "Invalid date" ? "" : moment(this.props.location.state.birthday).format('YYYY'),
                month: moment(this.props.location.state.birthday).format('MM') === "Invalid date" ? "" : moment(this.props.location.state.birthday).format('MM'),
                date: moment(this.props.location.state.birthday).format('D') === "Invalid date" ? "" : moment(this.props.location.state.birthday).format('D'),
            }) 
        }.bind(this), 0)
    }

    handleChange = (value, type) => {
        const re = /^[0-9\b]+$/

        if(type === "year" && (value === '' || re.test(value.trim()) ) ) {
            this.setState({ year: value.trim() })
        } else if(type === "month") {
            this.setState({ month: value.trim() })
        } else if(type === "date" && (value === '' || re.test(value.trim()) ) ) {
            this.setState({ date: value.trim() })
        }
    }

    validation = () => {

        let currentYear = parseInt(moment().format('YYYY'))

        let year = parseInt(this.state.year)
        let month = parseInt(this.state.month)
        let date = parseInt(this.state.date)

        if(this.state.year === '') {
            this.textFieldRef[0].current.focus()
            this.setState({ errorMassage: '생년월일을 정확히 입력해 주세요.' })
            return
        } else if(this.state.month === '') {
            this.setState({ errorMassage: '생년월일을 정확히 입력해 주세요.' })
            return
        } else if(this.state.date === '') {
            this.textFieldRef[1].current.focus()
            this.setState({ errorMassage: '생년월일을 정확히 입력해 주세요.' })
            return
        }
        
        if(year < 1000 || 10000 <= year) {  // 연도 4자리 수 입력
            this.textFieldRef[0].current.focus()
            this.setState({ errorMassage: '4자리 연도를 입력해 주세요.' })
            return
        } else if(year < 1890) {  // 1890년도 이후 입력 
            this.textFieldRef[0].current.focus()
            this.setState({ errorMassage: '올바른 연도를 입력해 주세요.' })
            return
        } else if(currentYear < year) {
            this.textFieldRef[0].current.focus()
            this.setState({ errorMassage: '올바른 연도를 입력해 주세요.' })
            return
        } else {
            this.setState({ errorMassage: '' })
        }
    
        if(month < 1 || 12 < month) {  // 월 범위 벗어나는 경우
            this.setState({ errorMassage: '올바른 월을 입력해 주세요.' })
            return
        } else {
            this.setState({ errorMassage: '' })
        }

        if(date < 1 || 31 < date) {  // 일 범위 벗어나는 경우
            this.textFieldRef[1].current.focus()
            this.setState({ errorMassage: '올바른 일을 입력해 주세요.' })
            return
        } else {
            this.setState({ errorMassage: '' })
        }

        if(this.state.year !== '' && this.state.month !== '' && this.state.date !== '') {
            let birthday
            if(this.state.month.length === 1) birthday = this.state.year + "0" + this.state.month + this.state.date
            else birthday = this.state.year + this.state.month + this.state.date
            if(this.state.date.length === 1) birthday = this.state.year + this.state.month + "0" + this.state.date
            else birthday = this.state.year + this.state.month + this.state.date

            if(!moment(birthday).isValid()) {
                this.setState({ errorMassage: '올바른 생년월일을 입력해 주세요.' })  // 올바른 날짜인지 검증
                return
            }
            else if(moment().isBefore(moment(birthday), 'date')) {
                this.setState({ errorMassage: '올바른 생년월일을 입력해 주세요.' })  // 현재 날짜 이후 생년월일 오류
                return
            }
            else {
                if(this.state.email !== "") {
                    this.onBirthdayChange(this.state.email, birthday).then(data => {
                        if (data.success) {
                            this.props.history.goBack()
                        }
                    })
                }
            }

        }
    }

    onClickSave = () => {
        this.validation()
    }

    onBirthdayChange = (email, birthday) => {
        return axios.post('/api/account/birthdayChange', { email, birthday }).then((res) => {
            console.log(res.data)
                if(this.props.status.isLoggedIn === true) {
                    if(res.data.code === 1) return { success: true };
                    else if(res.data.code === -1) {
                        this.setState({ errorMassage: '입력한 생일이 계정을 만든 날짜보다 이후입니다.' })
                        return { success: false }
                    }
                } else {
            console.log(res.data)

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
                        <Typography variant="h5" style={{color: "#0000008A", paddingLeft: "10px", width: "480px", minWidth: "230px"}}>생년월일</Typography>
                    </Box>
                </AppBar> 

                <Box style={{background: "#fff"}}>
                    <Grid container justify="center" style={{padding: "24px"}}>

                        <Paper variant="outlined" style={{width: "100%", minWidth: "250px", maxWidth: "450px", padding: "24px"}}>
                            <Typography variant="caption" style={{fontFamily: "NotoSansKR-Regular", color: "#0000008A"}}>
                                생년월일 선택
                            </Typography>

                            <Box display="flex" mt={3}>
                                <TextField autoFocus fullWidth variant="outlined" value={this.state.year || ""} onChange={event => this.handleChange(event.target.value, "year")}
                                            label={"연"} style={{width: "100%", minWidth: "70px"}} spellCheck="false" inputRef={this.textFieldRef[0]} />

                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel id="demo-simple-select-outlined-label">월</InputLabel>
                                    <Select labelId="demo-simple-select-outlined-label" id="demo-simple-select-outlined" value={this.state.month} onChange={event => this.handleChange(event.target.value, "month")} label="월" >
                                        <MenuItem value={"01"}>1월</MenuItem> <MenuItem value={"02"}>2월</MenuItem> <MenuItem value={"03"}>3월</MenuItem> 
                                        <MenuItem value={"04"}>4월</MenuItem> <MenuItem value={"05"}>5월</MenuItem> <MenuItem value={"06"}>6월</MenuItem> 
                                        <MenuItem value={"07"}>7월</MenuItem> <MenuItem value={"08"}>8월</MenuItem> <MenuItem value={"09"}>9월</MenuItem> 
                                        <MenuItem value={"10"}>10월</MenuItem> <MenuItem value={"11"}>11월</MenuItem> <MenuItem value={"12"}>12월</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField fullWidth variant="outlined" value={this.state.date || ""} onChange={event => this.handleChange(event.target.value, "date")} 
                                            label={"일"} style={{width: "100%", minWidth: "50px"}} spellCheck="false" inputRef={this.textFieldRef[1]}/>
                            </Box>

                            <Typography variant="body2" style={{fontFamily: "NotoSansKR-Regular", color: "#f44336", marginTop: "3px"}}>
                                &nbsp;{this.state.errorMassage}&nbsp;
                            </Typography>

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
