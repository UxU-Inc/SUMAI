import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import PrivacyContents from './policy/PrivacyContents'
import TermsContents from './policy/TermsContents'
import { DialogTitle, DialogActions, Button } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { checkSite } from '../functions/CheckSite';

const root = checkSite();


const useStyles = makeStyles((theme) => ({
  DialogContent: {
    '&::-webkit-scrollbar': {
      width: '0.2em'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      '-webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.2)',
      outline: '1px solid slategrey'
    },
    padding: '10px 20px',
  },
}))

export default function DialogContents(props) {
  const theme = useTheme();
    const classes = useStyles();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const {DialogContentState, setDialogContentState, contentType} = props

    const handleClose = () => {
        setDialogContentState(false)
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={DialogContentState} fullScreen={!matches}
        style={{justifyContent: 'center', margin: '0 auto'}}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose} style={{backgroundColor: root.PrimaryColor, color: 'white', padding: "10px 15px"}}>
                {(contentType==='privacy' && '개인정보처리방침') || (contentType==='terms' && '이용약관')}
            </DialogTitle>
            <DialogContent style={matches?{maxHeight: '500px', width: '450px',}:{}} className={classes.DialogContent} >
                {(contentType==='privacy' && <PrivacyContents/>) || (contentType==='terms' && <TermsContents/>)}
            </DialogContent>
            <DialogActions style={{backgroundColor: 'WhiteSmoke'}}>
                <Button onClick={handleClose}>확인</Button>
            </DialogActions>
        </Dialog>
    )
}

