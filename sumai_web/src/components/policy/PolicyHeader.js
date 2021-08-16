import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { useHistory, useLocation } from 'react-router';
import { useMediaQuery, useTheme } from '@material-ui/core';

import { checkSite } from '../../functions/CheckSite';
import { returnUrl } from '../../functions/util';

const root = checkSite();


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
    width: root.logoWidth,
    height: root.logoHeight,
    alt: root.site,
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

export default function PolicyHeader() {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const location = useLocation()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  const currentPathname = location.pathname;

  const link = React.useCallback((url) => {
    if (currentPathname !== url)
      history.push(url);
  }, [history, currentPathname])


  function HeaderButton(props) {
    const { newPathname, text } = props
    const classes = useStyles()

    return (
      <Box flex={1} style={{ marginRight: "-1px" }}>
        <Button className={`${classes.button} ${currentPathname === newPathname ? classes.buttonSelect : classes.buttonNomal}`} onClick={() => link(newPathname.concat(location.search))}>
          {text}
        </Button>
      </Box>
    )
  }


  return (
    <Box className={classes.root}>
      <AppBar position="static" className={classes.appbarStyle}>
        <Toolbar variant="dense">

          <a href={returnUrl()} className={classes.link} >
            <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />
          </a>

        </Toolbar>
      </AppBar>

      <Box className={classes.headerRoot}>

        <Box display="flex" justifyContent="center">
          <HeaderButton newPathname={'/terms'} text={'이용약관'}/>
          <HeaderButton newPathname={'/privacy'} text={'개인정보처리방침'}/>
          <HeaderButton newPathname={'/notices'} text={'공지사항'}/>
        </Box>

        {matches ? <Divider style={{ marginTop: "50px", marginBottom: "50px" }} /> : <></>}
      </Box>

    </Box>
  )
}