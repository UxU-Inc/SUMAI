import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import PrivacyContents from './policy/PrivacyContents'
import TermsContents from './policy/TermsContents'
import { DialogTitle, DialogActions, Button } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
  const { dialogStatus, setDialogStatus } = props

  const handleClose = () => {
    setDialogStatus(dialogStatus.type, false)
  }

  return (
    <Dialog onClose={() => handleClose()} aria-labelledby="customized-dialog-title" open={dialogStatus.open} fullScreen={!matches}
      style={{ justifyContent: 'center', margin: '0 auto' }}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose} style={{ backgroundColor: theme.palette.primary.main, color: 'white', padding: "10px 15px" }}>
        {(dialogStatus.type === 'privacy' && '개인정보처리방침') || (dialogStatus.type === 'terms' && '이용약관')}
      </DialogTitle>
      <DialogContent style={matches ? { maxHeight: '500px', width: '450px', } : {}} className={classes.DialogContent} >
        {(dialogStatus.type === 'privacy' && <PrivacyContents />) || (dialogStatus.type === 'terms' && <TermsContents />)}
      </DialogContent>
      <DialogActions style={{ backgroundColor: 'WhiteSmoke' }}>
        <Button onClick={handleClose}>확인</Button>
      </DialogActions>
    </Dialog>
  )
}

