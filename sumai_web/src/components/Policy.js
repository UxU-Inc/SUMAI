import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PrivacyContents from "./PrivacyContents";
import PolicyFooter from "./PolicyFooter";
import { useLocation } from 'react-router';
import PolicyHeader from './PolicyHeader';
import TermsContents from './TermsContents';
import NoticesContents from './NoticesContents';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflowX: 'hidden',
  },
  body: {
    backgroundColor: "#fff",
    [theme.breakpoints.between(0, 720)]: {
      padding: '20px'
    },
    [theme.breakpoints.up(720)]: {
      padding: "0 10%", minWidth: "300px",
    },
  }
}))

export default function Policy() {
  const classes = useStyles()
  const location = useLocation()
  const pathname = location.pathname;

  return (
    <Box className={classes.root}>
      <PolicyHeader />
      <Box className={classes.body}>
        {
          pathname === '/terms' ? <TermsContents /> : pathname === '/privacy' ? <PrivacyContents /> : pathname === '/notices' ? <NoticesContents /> : <></>
        }
      </Box>
      <PolicyFooter />
    </Box>
  )
}