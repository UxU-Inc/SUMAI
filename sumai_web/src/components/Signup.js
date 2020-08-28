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
import Slide from '@material-ui/core/Slide';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import FormHelperText from '@material-ui/core/FormHelperText';
import moment from "moment"
import axios from "axios"

const useStyles = theme => ({
    root: {
        height: '560px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        margin: '-267px 0 0 -225px',
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
    formControl: {
        flex: 1
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
            termsChecked: false,
            termsCheckederror: false,
            privacyChecked: false,
            privacyCheckederror: false,
            year: '',
            month: '',
            day: '',
            dateError: false,
            gender: '',
            slideOpen: 0,
            errorCode: 0,
            errorMessage: '',
        }
        this.textFieldRef = [React.createRef(), React.createRef(), React.createRef(), React.createRef()]
      }

    handleChange = (type, e) => {
        if(type === "email") {
            if(this.state.errorCode===1) {
                this.setState({
                    errorCode: 0,
                })
            }
            this.setState({
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
        } else if(type === "year") {
            if(/^[0-9]{0,4}$/i.test(e.target.value)) {
                this.setState({
                    year: e.target.value
                })
            }
        } else if(type === "day") {
            if(/^[0-9]{0,2}$/i.test(e.target.value)) {
                this.setState({
                    day: e.target.value
                })
            }
        }
        this.validation(type, e.target.value.trim(), e.target.checked)
    }
    validation = (type, value, checked) => {
        if(type === "email") {
            // 이메일 형식 검사
            const emailRegex = /^[0-9a-z]([-_.]?[0-9a-z])*@[0-9a-z]([-_.]?[0-9a-z])*\.[a-z]{2,3}$/i;
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
            const nameRegex = /^[a-zA-Z가-힣0-9]{2,10}$/;
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
        } else if (type === "terms") {
            // 비밀번호 확인
            if(!checked) {
                this.setState({
                    termsCheckederror: true,
                })
            } else {
                this.setState({
                    termsCheckederror: false,
                })
            }
        } else if (type === "privacy") {
            // 비밀번호 확인
            if(!checked) {
                this.setState({
                    privacyCheckederror: true,
                })
            } else {
                this.setState({
                    privacyCheckederror: false,
                })
            }
        } else if(type === "year") {
            if(value < 1000 || 10000 <= value) {  // 연도 4자리 수 입력
                this.setState({ birthCode: -100 })
                return
            } else if(value < 1890) {  // 1890년도 이후 입력 
                this.setState({ birthCode: -101 })
                return
            } 
        } else if(type === "month") {
            if(value < 1 || 12 < value ) {  // 월 범위 벗어나는 경우
                this.setState({ birthCode: -200 })
                return
            }
        } else if(type === "day") {
            if(value < 1 || 31 < value ) {  // 일 범위 벗어나는 경우
                this.setState({ birthCode: -300 })
                return
            }
        }

        if(this.state.year !== '' && this.state.month !== '' && this.state.day !== '') {
            let birthday = this.state.year + this.state.month + this.state.day
            if(moment(birthday).isValid()) this.setState({ birthCode: -400 })  // 올바른 날짜인지 검증
            else if(moment().isBefore(moment(birthday).format('YYYY-MM-DD'), 'day')) this.setState({ birthCode: -401 })  // 현재 날짜 이후 생년월일 오류
            else this.setState({ birthCode: 1 })
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
    onClickSignup = (e) => {

            // if(!(/^([0-9]{4}|[0-9]{0})$/i.test(this.state.year)) || !(/^([0-9]{2}|[0-9]{0})$/i.test(this.state.day))){
            //     this.setState({
            //         dateError: true,
            //     })
            // }else {
            //     this.setState({
            //         dateError: false,
            //     })
            // }

        if (this.state.slideOpen===0) { // 회원가입 누르면
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
        }
        

        if(!this.state.emailerror && !this.state.nameerror && !this.state.passworderror && !this.state.passwordcheckerror && !this.state.termsCheckederror && !this.state.privacyCheckederror) {
            if(this.state.slideOpen===0){
                this.props.onCheckSignupEmail(this.state.email).then((res) => { // 다음을 누를경우 이메일을 검사하는 코드
                    if(res.success) {
                        this.setState({
                            slideOpen: 1,
                        })
                    }else{
                        this.setState({
                            errorCode: 1,
                        })
                    }
                })
            }else if(this.state.slideOpen===1){ // 2번째 페이지에서 다음을 누를 경우..
                axios.post('/api/sendEmail/sendEmailCertification', {email: this.state.email}).then((res) => {
                    console.log('인증메일 전송했당께')
                })
                this.setState({
                    slideOpen: 2,
                })
                e.target.textContent='확인'
            }else if(this.state.slideOpen===2){
                this.props.onSignup(this.state.email, this.state.name, this.state.password).then(data => {
                    if (data.success) {
                        
                    } else {
                        this.setState({
                            errorCode: data.error
                        })
                    }
                })
            }
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
                            <Box height={'450px'} overflow='hidden' position='relative' >
                            <Slide direction="left" in={this.state.slideOpen===0} mountOnEnter unmountOnExit>
                                <CardContent style={{padding: "16px 10%", position: 'absolute'}}>
                                    <TextField autoFocus variant="outlined" value={this.state.email} onChange={this.handleChange.bind(this, "email")} error={this.state.emailerror || this.state.errorCode===1}
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
                            </Slide>
                            <Slide direction="left" in={this.state.slideOpen===1} mountOnEnter unmountOnExit>
                                <CardContent style={{display: 'flex', flexDirection: 'column', padding: "16px 10%", position: 'absolute'}}>
                                    <Box height='388px'>
                                        <Typography style={{color: '#0000008A', fontFamily: 'NotoSansKR-Regular'}}>선택사항</Typography>
                                        <FormControl style={{margin: "7.5px 0px 7.5px 0px"}}>
                                            <Box display='flex' >
                                                <Box className={classes.formControl} >
                                                    <TextField variant="outlined" value={this.state.year} onChange={this.handleChange.bind(this, "year")}
                                                        fullWidth label="연도" error={this.state.dateError} placeholder="4자리" margin='dense' onKeyPress={this.onKeyPress} spellCheck="false"/>
                                                </Box>
                                                <FormControl variant="outlined" className={classes.formControl} margin='dense' style={{paddingLeft: '4px'}}>
                                                    <InputLabel htmlFor="month" error={this.state.dateError}>월</InputLabel>
                                                    <Select
                                                    native
                                                    error={this.state.dateError}
                                                    label="월"
                                                    labelId='month'
                                                    defaultValue=''
                                                    >
                                                    <option value='' disabled hidden></option>
                                                    <option value={1}>1</option>
                                                    <option value={2}>2</option>
                                                    </Select>
                                                </FormControl>
                                                <FormControl className={classes.formControl} style={{paddingLeft: '4px'}}>
                                                    <TextField variant="outlined" value={this.state.day} onChange={this.handleChange.bind(this, "day")}
                                                        fullWidth label="일" error={this.state.dateError} placeholder="2자리" margin='dense' onKeyPress={this.onKeyPress} spellCheck="false"/>
                                                </FormControl>
                                            </Box>
                                            <FormHelperText error={true} variant='outlined'>{this.state.dateError? "생년월일 형식이 올바르지 않습니다.": false}</FormHelperText>
                                        </FormControl>

                                        <FormControl variant="outlined" margin='dense' style={{width: '100%'}}>
                                            <InputLabel htmlFor="gender">성별</InputLabel>
                                            <Select
                                            native
                                            label="성별"
                                            labelId='gender'
                                            >
                                            <option value={0}>비공개</option>
                                            <option value={1}>남성</option>
                                            <option value={2}>여성</option>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </CardContent>
                            </Slide>
                            <Slide direction="left" in={this.state.slideOpen===2} mountOnEnter unmountOnExit>
                                <CardContent style={{display: 'flex', flexDirection: 'column', padding: "16px 10%", position: 'absolute'}}>
                                    <Box height='auto' mt={2}>
                                        <Typography variant='h6' style={{color: '#0000008A'}}>SUMAI 서비스 회원가입을 환영합니다. <br/><br/><span style={{color: root.PrimaryColor}}>{this.state.email}</span>로 인증 메일을 보냈습니다. 메일을 확인해 주세요. <br/><br/>메일 인증 시 회원가입이 완료됩니다.</Typography>
                                    </Box>
                                </CardContent>
                            </Slide>
                            </Box>
                            

                            <CardActions className={classes.signupButtonLayout}>
                                <Button onClick={this.onClickSignup} className={classes.signupButton}>
                                    다음
                                </Button>
                            </CardActions>
                        </Card >
                    </Box >

                    <Snackbar open={this.state.errorCode!==0}> 
                        <Alert severity="error">
                            {
                                (this.state.errorCode===1 && "해당 이메일로 가입한 계정이 존재합니다.") ||
                                (this.state.errorCode===2 && "이메일 인증을 해달랑께롱") ||
                                (this.state.errorCode===3 && "인증상태가 아니시부룰")
                            }
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

                        <TextField autoFocus variant="outlined" value={this.state.email} onChange={this.handleChange.bind(this, "email")} error={this.state.emailerror || this.state.errorCode===1}
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

                    <Snackbar open={this.state.errorCode===1}>
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
