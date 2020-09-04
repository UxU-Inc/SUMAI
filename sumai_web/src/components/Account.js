/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component } from 'react'; 
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import imgLogo from '../images/sumai_logo_blue.png';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { connect } from 'react-redux';
import { logoutRequest } from '../actions/authentication';
import AccountImage from "./AccountImage";
import axios from 'axios';
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';
import moment from 'moment'
import CryptoJS from 'crypto-js';

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


class Account extends Component{ 
    constructor(props) {
      super(props);

      this.state = {
        open: false,
        id: '',
        imagesrc: '',
        passwordChangeTime: '',
        accountType: '',
        accountId: '',
        birthday: '',
        gender: '',
        avatarname: '',
        avatarcolor: '',
      }
    }

    componentDidMount() {
      this.accountInit()
    }

    componentDidUpdate() {
      if(this.props.status.loaded) {
          if(this.props.status.isLoggedIn === false) {
            setTimeout(function() { 
              this.props.history.push("/") 
            }.bind(this), 0)
          } 
      }
  }

    accountInit = () => {
      new Promise(async (resolve, reject) => {
          const Interval = setInterval(() => {
              if(typeof this.props.status.currentId !== "undefined") {
                  if(this.props.status.currentId === '') {
                    resolve();
                    clearInterval(Interval)
                  } else {
                    const id = this.props.status.currentId
                  axios.get('/api/account/accountLoad/'+id).then((data) => {
                    this.setState({
                      imagesrc: data.data.image,
                      passwordChangeTime: data.data.passwordChangeTime,
                      accountType: data.data.type,
                      accountId: data.data.id,
                      birthday: data.data.birthday,
                      gender: data.data.gender,
                      id : id,
                      avatarname: this.avatarName(this.props.status.currentUser),
                      avatarcolor: '#' + CryptoJS.MD5(id).toString().substring(1, 7),
                    })
                    })
                    resolve();
                    clearInterval(Interval)
                  }
              }
          });
      })
    }

    onClickLink = (url) => (e) => {
      if(typeof this.props.status.currentId !== "undefined") {
        this.props.history.push({
          pathname: url,
          state: { 
            birthday: this.state.birthday,
            gender: this.state.gender,
          }
        })
      }
    }

    handleopen = () => {
      this.setState({
        open: true,
      })
    }

    handleclose = (image) => {
      if(image === 'delete') {
        this.setState({
          open: false,
          imagesrc: ''
        })
      } else if(image !== '') {
        this.setState({
          open: false,
          imagesrc: image
        })
      } else {
        this.setState({
          ...this.state,
          open: false,
        })
      }
    }

    avatarName = (name) => {
      if(/[a-zA-Z0-9]/.test(name.charAt(0))) {
          return name.charAt(0)
      } else if(name.length >= 3){
          if (/[a-zA-Z0-9]/.test(name.substring(name.length-2, name.length))) {
            return name.charAt(0)
          } else {
            return name.substring(name.length-2, name.length)
          }
      } else {
        return name
      }
    }

    render(){ 
        const { classes } = this.props;

        console.log(this.props.status)
        console.log(this.state.imagesrc)

        /**************************************************** PC *****************************************************/
        if(isWidthUp('md', this.props.width)) {
          if(this.props.match.path === "/accounts") {
            return (
                <div>
                      <AppBar position="static" className={classes.AppBarStyle}>
                        <Toolbar variant="dense">

                            <a href="/" className={classes.link} >
                                <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                                <Typography style={{color: "#0000008A", paddingLeft: "10px", fontSize: "28px"}}>계정</Typography>
                            </a>

                        </Toolbar>
                      </AppBar> 

                      <Box style={{backgroundColor: "#fff"}}>
                          <Grid container justify="center" style={{paddingTop: "24px"}}>
                              <Grid >
                                  <Typography style={{color: "#303030", fontSize: "28px", fontFamily: "NotoSansKR-Regular"}}>개인정보</Typography>
                              </Grid>
                          </Grid>
                          
                          <Grid container justify="center" style={{paddingTop: "24px"}}>
                              <Paper variant="outlined" style={{maxWidth: "800px"}}>

                                  <Box display="flex" alignItems="center" style={{width: "100%", textTransform: "none"}}>
                                      {this.state.open? <AccountImage onClose={this.handleclose} id={this.props.status.currentId} imagesrc={this.state.imagesrc}/> : null}
                                      <Button onClick={this.handleopen} style={{padding: "15px 24px 16px", borderRadius: "0px"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          사진
                                        </Typography>
                                        <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                          프로필 사진 설정
                                        </Typography>
                                        <Box>
                                          {this.state.imagesrc !== ''? 
                                            <Avatar alt="profileImage" src={this.state.imagesrc} style={{width: "60px", height: "60px"}} /> : 
                                            <Avatar alt="profileImage" style={{width: "60px", height: "60px", backgroundColor: this.state.avatarcolor, textTransform: "none"}}>
                                              {this.state.avatarname}
                                            </Avatar>
                                          }
                                        </Box>
                                      </Button>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px"}}>
                                    <Button onClick={this.onClickLink("/accounts/name")} style={{width: "100%", padding: "15px 24px 16px", borderRadius: "0px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          이름
                                        </Typography>
                                        <Typography variant="subtitle1" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          {this.props.status.currentUser}
                                        </Typography>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                    </Button>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px"}}>
                                    <Button onClick={this.onClickLink("/accounts/password")} style={{width: "100%", padding: "15px 24px 16px", borderRadius: "0px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          비밀번호
                                        </Typography>
                                        <Box>
                                          <Typography variant="subtitle1" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020", letterSpacing: "1px"}}>
                                            ••••••••
                                          </Typography>
                                          <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                            최종 변경일: {moment(this.state.birthday).format('YYYY년 M월 D일') === "Invalid date" ? "" : moment(this.state.passwordChangeTime).format('YYYY. M. D.')}
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                    </Button>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{borderRadius: "0px", padding: "15px 24px 16px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          회원가입 계정
                                        </Typography>
                                        <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          {this.state.accountType === null ? "SUMAI" : this.state.accountType}
                                        </Typography>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px"}}>
                                    <Box display="flex" style={{width: "100%", padding: "15px 24px 16px", borderRadius: "0px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          이메일
                                        </Typography>
                                        <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          {this.props.status.currentEmail}
                                        </Typography>
                                    </Box>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px"}}>
                                    <Button onClick={this.onClickLink("/accounts/birthday")} style={{width: "100%", padding: "15px 24px 16px", borderRadius: "0px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          생년월일
                                        </Typography>
                                        <Typography variant="subtitle1" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          {this.state.birthday === null || moment(this.state.birthday).format('YYYY년 M월 D일') === "Invalid date" ? "생년월일 설정" : moment(this.state.birthday).format('YYYY년 M월 D일')}
                                        </Typography>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                    </Button>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px"}}>
                                    <Button onClick={this.onClickLink("/accounts/gender")} style={{width: "100%", padding: "15px 24px 16px", borderRadius: "0px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          성별
                                        </Typography>
                                        <Typography variant="subtitle1" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          {this.state.gender === null ? "성별 설정" : this.state.gender}
                                        </Typography>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                    </Button>
                                  </Box>
                                  
                              </Paper>

                          </Grid>

                          <Grid container justify="center" >
                            <Box display="flex" flexDirection="row-reverse" style={{width: "640px", marginTop: "10px"}}>
                              <Button onClick={this.onClickLink("/accounts/withdrawal")} style={{color: "#0000008A", fontFamily: "NotoSansKR-Light"}}>
                                회원탈퇴
                              </Button>
                            </Box>
                        </Grid>

                      </Box>
                    
                </div>
            )
          }

        } 


        /*************************************************** 모바일 ***************************************************/
        else {
          if(this.props.match.path === "/accounts") {
            return ( 
              <div>
                      <AppBar position="static" className={classes.AppBarStyle}>
                        <Toolbar variant="dense">

                            <a href="/" className={classes.link} >
                                <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                                <Typography style={{color: "#0000008A", paddingLeft: "10px", fontSize: "28px"}}>계정</Typography>
                            </a>

                        </Toolbar>
                      </AppBar> 

                      <Box style={{backgroundColor: "#fff", padding: "0px 8px"}}>
                          <Grid container justify="center" style={{padding: "24px 0px"}}>
                              <Grid >
                                  <Typography style={{color: "#303030", fontSize: "28px", fontFamily: "NotoSansKR-Regular"}}>개인정보</Typography>
                              </Grid>
                          </Grid>
                          
                          <Grid container justify="center">
                              <Paper variant="outlined" style={{width: "100%"}}>

                                  <Box display="flex" style={{width: "100%", borderRadius: "0px", textTransform: "none"}}>
                                      {this.state.open? <AccountImage onClose={this.handleclose} id={this.props.status.currentId} imagesrc={this.state.imagesrc}/> : null}
                                      <Button onClick={this.handleopen} style={{padding: "15px 24px 16px", width: "100%"}}>
                                        <Box style={{width: "100%", paddingRight: "10px", textTransform: "none"}} >
                                          <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                            사진
                                          </Typography>
                                          <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                            프로필 사진 설정
                                          </Typography>
                                        </Box>
                                        <Box>
                                        {this.state.imagesrc !== ''? 
                                            <Avatar alt="profileImage" src={this.state.imagesrc} style={{width: "60px", height: "60px"}} /> : 
                                            <Avatar alt="profileImage" style={{width: "60px", height: "60px", backgroundColor: this.state.avatarcolor}}>
                                              {this.state.avatarname}
                                            </Avatar>
                                          }
                                        </Box>
                                      </Button>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" style={{width: "100%", borderRadius: "0px", textTransform: "none"}}>
                                      <Button onClick={this.onClickLink("/accounts/name")} style={{padding: "15px 24px 16px", width: "100%"}}>
                                        <Box style={{width: "100%", paddingRight: "10px", textTransform: "none"}} >
                                          <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                            이름
                                          </Typography>
                                          <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                            {this.props.status.currentUser}
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                      </Button>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" style={{width: "100%", borderRadius: "0px", textTransform: "none"}}>
                                      <Button onClick={this.onClickLink("/accounts/password")} style={{padding: "15px 24px 16px", width: "100%"}}>
                                        <Box style={{width: "100%", paddingRight: "10px", textTransform: "none"}} >
                                          <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                            비밀번호
                                          </Typography>
                                          <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A", letterSpacing: "1px"}}>
                                            ••••••••
                                          </Typography>
                                          <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                            최종 변경일: {moment(this.state.birthday).format('YYYY년 M월 D일') === "Invalid date" ? "" : moment(this.state.passwordChangeTime).format('YYYY. M. D.')}
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                      </Button>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" style={{width: "100%", borderRadius: "0px"}}>
                                      <Box style={{width: "100%", padding: "15px 24px 16px", textTransform: "none"}} >
                                        <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          회원가입 계정
                                        </Typography>
                                        <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                          {this.state.accountType === null ? "SUMAI" : this.state.accountType}
                                        </Typography>
                                      </Box>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" style={{width: "100%", borderRadius: "0px"}}>
                                      <Box style={{width: "100%", padding: "15px 24px 16px", textTransform: "none"}} >
                                        <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          이메일
                                        </Typography>
                                        <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                          {this.props.status.currentEmail}
                                        </Typography>
                                      </Box>
                                  </Box>
                                  
                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" style={{width: "100%", borderRadius: "0px", textTransform: "none"}}>
                                      <Button onClick={this.onClickLink("/accounts/birthday")} style={{padding: "15px 24px 16px", width: "100%"}}>
                                        <Box style={{width: "100%", paddingRight: "10px", textTransform: "none"}} >
                                          <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                            생년월일
                                          </Typography>
                                          <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                            {this.state.birthday === null || moment(this.state.birthday).format('YYYY년 M월 D일') === "Invalid date" ? "생년월일 설정" : moment(this.state.birthday).format('YYYY년 M월 D일')}
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                      </Button>
                                  </Box>

                                  <Divider style={{margin: "0.1px 0px 0.1px 3%", height: "0.5px"}}/>

                                  <Box display="flex" style={{width: "100%", borderRadius: "0px", textTransform: "none"}}>
                                      <Button onClick={this.onClickLink("/accounts/gender")} style={{padding: "15px 24px 16px", width: "100%"}}>
                                        <Box style={{width: "100%", paddingRight: "10px", textTransform: "none"}} >
                                          <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                            성별
                                          </Typography>
                                          <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                            {this.state.gender === null ? "성별 설정" : this.state.gender}
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                      </Button>
                                  </Box>

                              </Paper>

                          </Grid>

                          <Grid container justify="center" >
                            <Box display="flex" flexDirection="row-reverse" style={{width: "720px", maxWidth: "800px", marginTop: "10px"}}>
                              <Button onClick={this.onClickLink("/accounts/withdrawal")} style={{color: "#0000008A", fontFamily: "NotoSansKR-Light"}}>
                                회원탈퇴
                              </Button>
                            </Box>
                        </Grid>

                      </Box>
                    
                  </div>
          )
        }

      }



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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(withWidth()(Account)));


