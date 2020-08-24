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
    button: {
        variant: 'contained',
        color: '#666',
        border: '1px solid #d4d4d4',
        width: '100%',
        height: '50px',
        fontSize: '15px',
        borderRadius: '0px',
        
        "&:hover": {
          fontWeight: "bold",
          background: "#ffffff",
          textDecorationLine: 'underline',
        },
    },
    buttonSelect: {
      variant: 'contained',
      color: '#fff',
      border: '1px solid #d4d4d4',
      width: '100%',
      height: '50px',
      fontSize: '15px',
      borderRadius: '0px',
      background: "#1e1e1e",
      
      "&:hover": {
        fontWeight: "bold",
        background: "#1e1e1e",
        textDecorationLine: 'underline',
      },
}});

class Account extends Component{ 

    onClickLink = (url) => (e) => {
      this.props.history.push(url)
    }

    render(){ 
        const { classes } = this.props;

        console.log(this.props.match.path)

        /**************************************************** PC *****************************************************/
        if(isWidthUp('md', this.props.width)) {
          if(this.props.match.path === "/account") {
            return ( 
                <div>
                      <AppBar position="static" className={classes.AppBarStyle}>
                        <Toolbar variant="dense">

                            <a href="/account" className={classes.link} >
                                <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                                <Typography style={{color: "#0000008A", paddingLeft: "10px", fontSize: "28px"}}>계정</Typography>
                            </a>

                        </Toolbar>
                      </AppBar> 

                      <Box style={{backgroundColor: "#fff", padding: "0px 76px"}}>
                          <Grid container justify="center" style={{paddingTop: "24px"}}>
                              <Grid >
                                  <Typography style={{color: "#303030", fontSize: "28px", fontFamily: "NotoSansKR-Regular"}}>개인정보</Typography>
                              </Grid>
                          </Grid>
                          
                          <Grid container justify="center" style={{paddingTop: "24px"}}>
                              <Paper variant="outlined" style={{maxWidth: "800px"}}>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px", textTransform: "none"}}>
                                      <Button style={{padding: "15px 24px 16px"}}>
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

                                  <Divider style={{marginLeft: "3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px"}}>
                                    <Button onClick={this.onClickLink("/account/name")} style={{width: "100%", padding: "15px 24px 16px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          이름
                                        </Typography>
                                        <Typography variant="subtitle1" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          test
                                        </Typography>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                    </Button>
                                  </Box>

                                  <Divider style={{marginLeft: "3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px"}}>
                                    <Button style={{width: "100%", padding: "15px 24px 16px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          비밀번호
                                        </Typography>
                                        <Box>
                                          <Typography variant="subtitle1" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020", letterSpacing: "1px"}}>
                                            ••••••••
                                          </Typography>
                                          <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                            최종 변경일: 8월 8일
                                          </Typography>
                                        </Box>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                    </Button>
                                  </Box>

                                  <Divider style={{marginLeft: "3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{borderRadius: "0px", padding: "15px 24px 16px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          회원가입 계정
                                        </Typography>
                                        <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          카카오
                                        </Typography>
                                  </Box>

                                  <Divider style={{marginLeft: "3%", height: "0.5px"}}/>

                                  <Box display="flex" alignItems="center" style={{width: "100%", borderRadius: "0px"}}>
                                    <Button style={{width: "100%", padding: "15px 24px 16px", textTransform: "none"}}>
                                        <Typography variant="caption" style={{width: "156px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#0000008A"}}>
                                          이메일
                                        </Typography>
                                        <Typography variant="subtitle2" style={{width: "376.4px", textAlign: "left", fontFamily: "NotoSansKR-Light", color: "#202020"}}>
                                          test@gmail.com
                                        </Typography>
                                        <ArrowForwardIosIcon fontSize="small" style={{marginLeft: "auto", color: "#0000008A"}}/>
                                    </Button>
                                  </Box>
                                  
                              </Paper>

                          </Grid>

                          <Grid container justify="center" >
                            <Box display="flex" flexDirection="row-reverse" style={{width: "640px", maxWidth: "800px", marginTop: "10px"}}>
                              <Button style={{color: "#0000008A"}}>
                                회원탈퇴
                              </Button>
                            </Box>
                        </Grid>

                      </Box>
                    
                </div>
            )
          }

          /* 이름 변경 컴포넌트 */
          else if(this.props.match.path === "/account/name") {
            return <AccountNameChange />
          }

        } 


        /*************************************************** 모바일 ***************************************************/
        else {
          return ( 
            <div className={classes.root}>
                <AppBar position="static" className={classes.AppBarStyle}>
                    <Toolbar variant="dense">

                        <a href="/" className={classes.link} >
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                        </a>

                    </Toolbar>
                </AppBar> 

                <div style={{backgroundColor: "#fff", margin: "-1px -1px 0px -1px"}}>
                    
                    <Box display="flex" justifyContent="center">
                      <Box flex={1} style={{marginRight: "-1px"}}>
                        <Button className={classes.buttonSelect}>
                          이용약관
                        </Button>
                      </Box>
                      <Box flex={1} style={{marginRight: "-1px"}}>
                        <Button className={classes.button} >
                          개인정보처리방침
                        </Button>
                      </Box>
                      <Box flex={1} >
                        <Button className={classes.button} >
                          공지사항
                        </Button>
                      </Box>
                    </Box>

                    <div style={{padding: "20px"}}>
                        <TermsContents/>
                    </div>
                </div>
                
            </div>
        )
      }



    } 
}

export default withStyles(useStyles)(withWidth()(Account));


