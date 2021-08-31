import React, { useReducer, useRef, useState } from 'react';
import { useTheme, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Snackbar from '@material-ui/core/Snackbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';


import useMediaQuery from '@material-ui/core/useMediaQuery';

import Slide from '@material-ui/core/Slide';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useHistory } from 'react-router-dom';

import { checkSite } from '../../functions/CheckSite';
import Slide0 from './Slide0';
import Slide1 from './Slide1';
import axios from 'axios';
import Slide2 from './Slide2';

const root = checkSite();

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    flexDirection: 'column',
    display: 'flex',
    [theme.breakpoints.between(0, 600)]: {
      position: "relative",
    },
    [theme.breakpoints.up(600)]: {
      '&::before, &::after': {
        minHeight: '30px',
        height: '24px',
        boxSizing: 'border-box',
        display: 'block',
        content: '""',
        flexGrow: 1,
      },
    },
  },
  card: {
    position: 'relative',
    [theme.breakpoints.between(0, 600)]: {
      padding: '40px 40px 0px 40px',
      boxShadow: '0px 0px'
    },
    [theme.breakpoints.up(600)]: {
      maxWidth: '450px',
      width: '100%',
      minWidth: '300px',
    },
  },
  cardHead: {
    [theme.breakpoints.between(0, 600)]: {
      padding: '0px',
      marginBottom: '15px'
    },
    [theme.breakpoints.up(600)]: {
      borderBottom: '1px solid #e0e0e0',
      color: '#0000008a',
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(2),
    },
  },
  cardBody: {
    [theme.breakpoints.between(0, 600)]: {
      position: "relative",
      overflow: 'hidden',
      paddingBottom: '25px',
    },
    [theme.breakpoints.up(600)]: {
      padding: "16px 10%",
      minHeight: '450px',
    }
  },
  signupButtonLayout: {
    padding: theme.spacing(0),
  },
  signupButton: {
    variant: 'contained',
    color: '#ffffff',
    background: theme.palette.primary.main,
    "&:hover": {
      background: theme.palette.hover.main
    },
    width: '100%',
    height: '50px',
    fontSize: '20px',
    fontWeight: 'bold',
    borderRadius: '0px',
  },
  imgLogo: {
    width: root.logoWidth,
    height: root.logoHeight,
    alt: root.site,
  },
}))

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SnackbarReducer(state, action) {
  if (action.reason === 'clickaway') return state
  switch (action.type) {
    case 'error':
    case 'success':
      return {...action, open: true};
    case 'close':
      return {...state, open: false};
    default:
      return state;
  }
}

export default function Signup() {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up('sm'));

  const classes = useStyles();

  const [account, setAccount] = useState({});

  const [slideNumber, setSlideNumber] = useState(0);

  const History = useHistory();

  const [snackbar, snackbarDispatch] = useReducer(SnackbarReducer, null);


  const enteredRef = [useRef(), useRef(), useRef()];
  const submitRef = [useRef(), useRef(), useRef()];

  const onEnterSlide = (e) => {
    e.style.position = 'relative'
  }
  const onEnteredSlide = (e) => {
    enteredRef[slideNumber].current();
  }
  const onExitingSlide = (e) => {
    e.style.position = 'absolute'
  }

  const sendCertMail = async () => {
    try {
      await axios.post('/api/email/sendEmailCertification', { email: account.email, name: account.name, siteType:root.site });

      return true;
    } catch(e) {
      return false;
    }
  }
  
  const onClickSignup = async (e) => {
    const state = await submitRef[slideNumber].current();

    if (!state) return;

    if (slideNumber < 2) {
      setAccount({...account, ...state});
      
      setSlideNumber(slideNumber + 1);
    } else {
      e.target.textContent = '완료';
    }
  }
  
  const onClickBack = () => {
    if (slideNumber === 0) {
      History.goBack()
    } else {
      setSlideNumber(slideNumber-1);
    }
  }
  
  return (
    <div className={classes.root}>
      <Box display="flex" justifyContent="center">
        <Card elevation={3} className={classes.card}>
          <CardHeader className={classes.cardHead} style={{ minHeight: '48px' }}
            title={
              sm ?
                <Box display="flex" alignItems="center">
                  {slideNumber < 2
                    ? <IconButton style={{ marginRight: "10px" }} onClick={onClickBack}>
                      <ArrowBackIcon style={{ color: "#0000008A" }} />
                    </IconButton>
                    : null}

                  <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />

                  <Typography style={{ color: "#0000008A", fontSize: "28px", marginLeft: "10px" }}>
                    계정 만들기
                  </Typography>
                </Box>
                :
                <Box>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Box style={{ position: "absolute", left: "20px" }}>
                      {slideNumber < 2
                        ? <IconButton onClick={onClickBack}>
                          <ArrowBackIcon style={{ color: "#0000008A" }} />
                        </IconButton>
                        : null}
                    </Box>

                    <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />
                  </Box>

                  <Box display="flex" justifyContent="center" style={{ paddingTop: "10px" }}>
                    <Typography style={{ color: "#0000008A", fontSize: "28px", minWidth: "140px" }}>
                      계정 만들기
                    </Typography>
                  </Box>
                </Box>
            }
          />
          <form autoComplete="off">
            <Box className={classes.cardBody}>
              <Slide style={{ position: 'absolute', }} direction="left" in={slideNumber === 0} unmountOnExit timeout={{ exit: 0, enter: 0, }} onEnter={onEnterSlide} onExiting={onExitingSlide} onEntered={onEnteredSlide}>
                <CardContent style={{ padding: 0 }}>
                  <Slide0 enteredCallback={enteredRef[0]} submitCallback={submitRef[0]} account={account} snackbarDispatch={snackbarDispatch}/>
                </CardContent>
              </Slide>

              <Slide style={{ position: 'absolute', }} direction="left" in={slideNumber === 1} timeout={{ exit: 0, enter: 500, }} onEnter={onEnterSlide} onExiting={onExitingSlide} onEntered={onEnteredSlide}>
                <CardContent style={{ padding: 0 }}>
                  <Slide1 enteredCallback={enteredRef[1]} submitCallback={submitRef[1]} sendCertMail={sendCertMail}/>
                </CardContent>
              </Slide>

              <Slide style={{ position: 'absolute', }} direction="left" in={slideNumber === 2} timeout={{ exit: 0, enter: 500, }} onEnter={onEnterSlide} onExiting={onExitingSlide} onEntered={onEnteredSlide}>
                <CardContent style={{ padding: 0 }}>
                  <Slide2 enteredCallback={enteredRef[2]} submitCallback={submitRef[2]} sendCertMail={sendCertMail} account={account} snackbarDispatch={snackbarDispatch} />

                </CardContent>
              </Slide>
            </Box>
          </form>

          <CardActions className={classes.signupButtonLayout}>
            <Button onClick={e => onClickSignup(e)} className={classes.signupButton}>
              다음
            </Button>
          </CardActions>
        </Card >
      </Box >
  
      <Snackbar open={snackbar?.open} autoHideDuration={3000} onClose={(event, reason) => snackbarDispatch({type: 'close', reason: reason})}>
        <Alert severity={snackbar?.type}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </div>
  )
}