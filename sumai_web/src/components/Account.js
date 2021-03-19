/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import imgLogo from '../images/sumai_logo_blue.png';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AccountImage from "./AccountImage";
import axios from 'axios';
import moment from 'moment'
import CryptoJS from 'crypto-js';

const useStyles = makeStyles((theme) => ({
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
  contentRoot: {
    backgroundColor: '#fff',
    [theme.breakpoints.between(0, 720)]: {
      padding: '0px 8px',
    },
  },
  contentBody: {
    [theme.breakpoints.between(0, 720)]: {
      width: '100%'
    },
    [theme.breakpoints.up(720)]: {
      maxWidth: '640px',
      width: '100vw',
    },
  },
  itemButton: {
    padding: '15px 24px 16px',
    width: '100%',
    borderRadius: '0px',
    textTransform: 'none',
  },
  itemRoot: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContext: {
    display: 'flex',
    width: '100%',
    [theme.breakpoints.between(0, 720)]: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    [theme.breakpoints.up(720)]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  itemTitle: {
    color: "#0000008A",
    fontFamily: "NotoSansKR-Light",
    textAlign: "left",
    [theme.breakpoints.up(720)]: {
      flexBasis: '156px'
    },
  },
  itemContent: {
    textAlign: "left",
    fontFamily: "NotoSansKR-Light",
    // color: "#000000EA",
    [theme.breakpoints.up(720)]: {
      flex: 'auto',
    },
  },
}))

function useLoadAccount() {
  const status = useSelector(state => state.authentication.status)
  const [account, setAccount] = React.useState({})
  const history = useHistory()
  
  const avatarName = React.useCallback((name) => {
    if (/[a-zA-Z0-9]/.test(name.charAt(0))) {
      return name.charAt(0)
    } else if (name.length >= 3) {
      if (/[a-zA-Z0-9]/.test(name.substring(name.length - 2, name.length))) {
        return name.charAt(0)
      } else {
        return name.substring(name.length - 2, name.length)
      }
    } else {
      return name
    }
  }, [])

  const loadAccount = React.useCallback(async() => {
    try {
      const id = status.currentId
      const data = await axios.post('/api/account/accountLoad', {})
      setAccount({
        ...data.data,
        avatarname: avatarName(status.currentUser),
        avatarcolor: '#' + CryptoJS.MD5(id).toString().substring(1, 7),
      })
    } catch(e) {
      history.push("/") // 로직 변경해야함
    }
  }, [avatarName, status, history])

  React.useEffect(() => {
    if(status.loaded) {
      loadAccount()
    }
  }, [loadAccount, status])

  return [account]
}

export default function Account() {
  const [account] = useLoadAccount()
  const [open, setOpen] = React.useState(false)
  const classes = useStyles();
  const history = useHistory()

  const handleclose = React.useCallback((image) => {
    if (image === 'delete') {
      account.image = ''
    } else if (image !== '') {
      account.image = image
    }
    setOpen(false)
  }, [account])

  const onClickLink = React.useCallback((url) => {
    if (Object.keys(account).length !== 0 || account.constructor !== Object) {
      history.push({
        pathname: url,
        state: {
          birthday: account.birth,
          gender: account.gender,
        }
      })
    }
  }, [account, history])

  return (
    <Box>
      <AppBar position="static" className={classes.AppBarStyle}>
        <Toolbar variant="dense">

          <a href="/" className={classes.link} >
            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} />
            <Typography style={{ color: "#0000008A", paddingLeft: "10px", fontSize: "28px" }}>계정</Typography>
          </a>

        </Toolbar>
      </AppBar>

      <Box className={classes.contentRoot}>
        <Grid container justify="center" style={{ paddingTop: "24px" }}>
          <Typography style={{ color: "#303030", fontSize: "28px", fontFamily: "NotoSansKR-Regular" }}>개인정보</Typography>
        </Grid>

        <Grid container justify="center" style={{ paddingTop: "24px" }}>
          <Paper variant="outlined" className={classes.contentBody}>

            {open ? <AccountImage onClose={handleclose} id={account.id} imagesrc={account.image} /> : null}
            <Button onClick={()=>setOpen(true)} className={classes.itemButton}>
              <Box className={classes.itemRoot}>
                <Box className={classes.itemContext}>
                  <Typography variant="caption" className={classes.itemTitle}>
                    사진
                                    </Typography>
                  <Typography variant="subtitle2" className={classes.itemContent}>
                    프로필 사진 설정
                                    </Typography>
                </Box>
                <Box>
                  {account.image !== '' ?
                    <Avatar alt="profileImage" src={account.image} style={{ width: "60px", height: "60px" }} /> :
                    <Avatar alt="profileImage" style={{ width: "60px", height: "60px", backgroundColor: account.avatarcolor, textTransform: "none" }}>
                      {account.avatarname}
                    </Avatar>
                  }
                </Box>
              </Box>
            </Button>

            <Divider style={{ margin: "0.1px 0px 0.1px 3%", height: "0.5px" }} />

            <Button onClick={() => onClickLink("/accounts/name")} className={classes.itemButton}>
              <Box className={classes.itemRoot}>
                <Box className={classes.itemContext}>
                  <Typography variant="caption" className={classes.itemTitle}>
                    이름
                                </Typography>
                  <Typography variant="subtitle2" className={classes.itemContent} >
                    {account.name}
                  </Typography>
                </Box>
                <ArrowForwardIosIcon fontSize="small" style={{ marginLeft: "auto", color: "#0000008A" }} />
              </Box>
            </Button>

            <Divider style={{ margin: "0.1px 0px 0.1px 3%", height: "0.5px" }} />

            {account.type === "SUMAI" ? <>
              <Button onClick={() => onClickLink("/accounts/password")} className={classes.itemButton}>
                <Box className={classes.itemRoot}>
                  <Box className={classes.itemContext}>
                    <Typography variant="caption" className={classes.itemTitle}>
                      비밀번호
                                </Typography>
                    <Box>
                      <Typography variant="subtitle2" className={classes.itemContent} style={{ letterSpacing: "1px" }}>
                        ••••••••
                                  </Typography>
                      <Typography variant="subtitle2" className={classes.itemContent}>
                        최종 변경일: {moment(account.passwordChangeTime).format('YYYY. M. D.') === "Invalid date" ? "" : moment(account.passwordChangeTime).format('YYYY. M. D.')}
                      </Typography>
                    </Box>
                  </Box>
                  <ArrowForwardIosIcon fontSize="small" style={{ marginLeft: "auto", color: "#0000008A" }} />
                </Box>
              </Button>
              <Divider style={{ margin: "0.1px 0px 0.1px 3%", height: "0.5px" }} />
            </> : null}

            <Box className={classes.itemRoot} style={{ borderRadius: "0px", padding: "15px 24px 16px", textTransform: "none" }}>
              <Box className={classes.itemContext}>
                <Typography variant="caption" className={classes.itemTitle}>
                  회원가입 계정
                                </Typography>
                <Typography variant="subtitle2" className={classes.itemContent}>
                  {account.type === null ? "SUMAI" : account.type}
                </Typography>
              </Box>
            </Box>

            <Divider style={{ margin: "0.1px 0px 0.1px 3%", height: "0.5px" }} />

            <Box className={classes.itemRoot} style={{ borderRadius: "0px", padding: "15px 24px 16px", textTransform: "none" }}>
              <Box className={classes.itemContext}>
                <Typography variant="caption" className={classes.itemTitle}>
                  이메일
                                </Typography>
                <Typography variant="subtitle2" className={classes.itemContent}>
                  {account.email}
                </Typography>
              </Box>
            </Box>

            <Divider style={{ margin: "0.1px 0px 0.1px 3%", height: "0.5px" }} />

            <Button onClick={() => onClickLink("/accounts/birthday")} className={classes.itemButton}>
              <Box className={classes.itemRoot}>
                <Box className={classes.itemContext}>
                  <Typography variant="caption" className={classes.itemTitle}>
                    생년월일
                                </Typography>
                  <Typography variant="subtitle2" className={classes.itemContent}>
                    {account.birth === null || moment(account.birth).format('YYYY년 M월 D일') === "Invalid date" ? "생년월일 설정" : moment(account.birth).format('YYYY년 M월 D일')}
                  </Typography>
                </Box>
                <ArrowForwardIosIcon fontSize="small" style={{ marginLeft: "auto", color: "#0000008A" }} />
              </Box>
            </Button>

            <Divider style={{ margin: "0.1px 0px 0.1px 3%", height: "0.5px" }} />

            <Button onClick={() => onClickLink("/accounts/gender")} className={classes.itemButton}>

              <Box className={classes.itemRoot}>
                <Box className={classes.itemContext}>
                  <Typography variant="caption" className={classes.itemTitle}>
                    성별
                                </Typography>
                  <Typography variant="subtitle2" className={classes.itemContent}>
                    {account.gender === null ? "성별 설정" : account.gender}
                  </Typography>
                </Box>
                <ArrowForwardIosIcon fontSize="small" style={{ marginLeft: "auto", color: "#0000008A" }} />
              </Box>
            </Button>

          </Paper>

        </Grid>

        <Grid container justify="center" >
          <Box display="flex" flexDirection="row-reverse" style={{ width: "640px", marginTop: "10px" }}>
            <Button onClick={() => onClickLink("/accounts/withdrawal")} style={{ color: "#0000008A", fontFamily: "NotoSansKR-Light" }}>
              회원탈퇴
                      </Button>
          </Box>
        </Grid>

      </Box>
    </Box>
  )
}