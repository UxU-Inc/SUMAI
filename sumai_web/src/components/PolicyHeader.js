import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import imgLogo from '../images/sumai_logo.png';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { useHistory, useLocation } from 'react-router';
import { useMediaQuery, useTheme } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflowX: 'hidden'
  },
  appbarStyle: {
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
  headerRoot: {
    backgroundColor: "#fff",

    [theme.breakpoints.between(0, 720)]: {
      margin: "-1px -1px 0px -1px"
    },
    [theme.breakpoints.up(720)]: {
      padding: "50px 10% 0", minWidth: "300px",
    },
  },
  button: {
    border: '1px solid #d4d4d4',
    width: '100%',
    height: '50px',
    fontSize: '15px',
    borderRadius: '0px',

    "&:hover": {
      fontWeight: "bold",
      textDecorationLine: 'underline',
    },
  },
  buttonNomal: {
    color: '#666',
    "&:hover": {
      background: "#ffffff",
    },
  },
  buttonSelect: {
    color: '#fff',
    background: "#1e1e1e",
    "&:hover": {
      background: "#1e1e1e",
    },
  },
}))

function HeaderButton(props) {
  const { currentPathname, newPathname, text, link } = props
  const classes = useStyles()


  return (
    <Box flex={1} style={{ marginRight: "-1px" }}>
      <Button className={`${classes.button} ${currentPathname === newPathname ? classes.buttonSelect : classes.buttonNomal}`} onClick={() => link(newPathname)}>
        {text}
      </Button>
    </Box>
  )
}

export default function PolicyHeader() {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const location = useLocation()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  const pathname = location.pathname;

  const link = React.useCallback((url) => {
    if (pathname !== url)
      history.push(url);
  }, [history, pathname])


  return (
    <Box className={classes.root}>
      <AppBar position="static" className={classes.appbarStyle}>
        <Toolbar variant="dense">

          <a href="/" className={classes.link} >
            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} />
          </a>

        </Toolbar>
      </AppBar>

      <Box className={classes.headerRoot}>

        <Box display="flex" justifyContent="center">
          <HeaderButton currentPathname={pathname} newPathname={'/terms'} text={'이용약관'} link={link} />
          <HeaderButton currentPathname={pathname} newPathname={'/privacy'} text={'개인정보처리방침'} link={link} />
          <HeaderButton currentPathname={pathname} newPathname={'/notices'} text={'공지사항'} link={link} />
        </Box>

        {matches ? <Divider style={{ marginTop: "50px", marginBottom: "50px" }} /> : <></>}
      </Box>

    </Box>
  )
}