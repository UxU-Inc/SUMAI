/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component } from 'react'; 
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import imgLogo from '../images/sumai_logo_blue.png';
import TermsContents from "../components/TermsContents"; 
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import AccountNameChange from "./AccountNameChange";
import AccountPassword from "./AccountPassword";
import { connect } from 'react-redux';

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

    onClickLink = (url) => (e) => {
      this.props.history.push(url)
    }

    render(){ 
        const { classes } = this.props;

        console.log(this.props.status)

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
                                      <Button style={{padding: "15px 24px 16px", borderRadius: "0px"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          사진
                                        </Typography>
                                        <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                          프로필 사진 설정
                                        </Typography>
                                        <Box>
                                          <Avatar alt="test" src="https://material-ui.com/static/images/avatar/1.jpg" style={{width: "60px", height: "60px"}} />
                                          
                                        </Box>
                                      </Button>
                                  </Box>

                                  <Divider zindex={1} style={{marginLeft: "3%", height: "0.5px"}}/>

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

                                  <Divider zindex={1} style={{marginLeft: "3%", height: "0.5px"}}/>

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
                                            최종 변경일: 1월 1일
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                    </Button>
                                  </Box>

                                  <Divider zindex={1} style={{marginLeft: "3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{borderRadius: "0px", padding: "15px 24px 16px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          회원가입 계정
                                        </Typography>
                                        <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          카카오
                                        </Typography>
                                  </Box>

                                  <Divider zindex={1} style={{marginLeft: "3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px"}}>
                                    <Button style={{width: "100%", padding: "15px 24px 16px", borderRadius: "0px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          이메일
                                        </Typography>
                                        <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          {this.props.status.currentEmail}
                                        </Typography>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                    </Button>
                                  </Box>
                                  
                              </Paper>

                          </Grid>

                          <Grid container justify="center" >
                            <Box display="flex" flexDirection="row-reverse" style={{width: "640px", marginTop: "10px"}}>
                              <Button style={{color: "#0000008A", fontFamily: "NotoSansKR-Light"}}>
                                회원탈퇴
                              </Button>
                            </Box>
                        </Grid>

                      </Box>
                    
                </div>
            )
          }

          /* 이름 변경 컴포넌트 */
          else if(this.props.match.path === "/accounts/name") {
            return <AccountNameChange />
          }

          /* 비밀번호 변경 컴포넌트 */
          else if(this.props.match.path === "/accounts/password") {
            return <AccountPassword />
          }

        } 


        /*************************************************** 모바일 ***************************************************/
        else {
          if(this.props.match.path === "/accounts") {
            return ( 
              <div>
                      <AppBar position="static" className={classes.AppBarStyle}>
                        <Toolbar variant="dense">

                            <a href="/accounts" className={classes.link} >
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
                                      <Button style={{padding: "15px 24px 16px", width: "100%"}}>
                                        <Box style={{width: "100%", paddingRight: "10px", textTransform: "none"}} >
                                          <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                            사진
                                          </Typography>
                                          <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                            프로필 사진 설정
                                          </Typography>
                                        </Box>
                                        <Box>
                                          <Avatar alt="test" src="https://material-ui.com/static/images/avatar/1.jpg" style={{width: "60px", height: "60px"}} />
                                          
                                        </Box>
                                      </Button>
                                  </Box>

                                  <Divider style={{marginLeft: "3%", height: "0.5px"}}/>

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

                                  <Divider style={{marginLeft: "3%", height: "0.5px"}}/>

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
                                            최종 변경일: 1월 1일
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                      </Button>
                                  </Box>

                                  <Divider style={{marginLeft: "3%", height: "0.5px"}}/>

                                  <Box display="flex" style={{width: "100%", borderRadius: "0px", textTransform: "none"}}>
                                      <Button style={{padding: "15px 24px 16px", width: "100%", textTransform: "none"}}>
                                        <Box style={{width: "100%", paddingRight: "10px"}} >
                                          <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                            회원가입 계정
                                          </Typography>
                                          <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                            카카오
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                      </Button>
                                  </Box>

                                  <Divider style={{marginLeft: "3%", height: "0.5px"}}/>

                                  <Box display="flex" style={{width: "100%", borderRadius: "0px", textTransform: "none"}}>
                                      <Button style={{padding: "15px 24px 16px", width: "100%"}}>
                                        <Box style={{width: "100%", paddingRight: "10px", textTransform: "none"}} >
                                          <Typography style={{textAlign: "left", fontSize: "12px", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                            이메일
                                          </Typography>
                                          <Typography variant="subtitle2" style={{textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#000008A"}}>
                                            {this.props.status.currentEmail}
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                      </Button>
                                  </Box>

                              </Paper>

                          </Grid>

                          <Grid container justify="center" >
                            <Box display="flex" flexDirection="row-reverse" style={{width: "720px", maxWidth: "800px", marginTop: "10px"}}>
                              <Button style={{color: "#0000008A", fontFamily: "NotoSansKR-Light"}}>
                                회원탈퇴
                              </Button>
                            </Box>
                        </Grid>

                      </Box>
                    
                  </div>
          )
        }

        /* 이름 변경 컴포넌트 */
        else if(this.props.match.path === "/accounts/name") {
          return <AccountNameChange />
        }

        /* 비밀번호 변경 컴포넌트 */
        else if(this.props.match.path === "/accounts/password") {
          return <AccountPassword />
        }


      }



    } 
}

const mapStateToProps = (state) => {
  return {
      status: state.authentication.status,
  };
};


export default connect(mapStateToProps, null)(withStyles(useStyles)(withWidth()(Account)));


