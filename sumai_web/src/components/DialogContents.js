import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import PrivacyContents from './PrivacyContents'
import TermsContents from './TermsContents'
import { DialogTitle, DialogActions, Button } from '@material-ui/core';
import * as root from '../rootValue';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em'
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey'
    }
  }
});

function DialogContents(props) {
    const classes = useStyles();
    const {DialogContentState, setDialogContentState, contentType} = props

    const handleClose = () => {
        setDialogContentState(false)
    }

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={DialogContentState}
        style={{width: '500px', justifyContent: 'center', margin: '0 auto'}}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose} style={{backgroundColor: root.PrimaryColor, color: 'white', padding: "10px 15px"}}>
                {(contentType==='privacy' && '개인정보처리방침') || (contentType==='terms' && '이용약관')}
            </DialogTitle>
            <DialogContent style={{maxHeight: '500px', padding:'10px 20px'}} className={classes.scrollBar}>
                {(contentType==='privacy' && <PrivacyContents/>) || (contentType==='terms' && <TermsContents/>)}
            </DialogContent>
            <DialogActions style={{backgroundColor: 'WhiteSmoke'}}>
                <Button onClick={handleClose}>확인</Button>
            </DialogActions>
        </Dialog>
    )
}

export default withStyles(useStyles)(DialogContents);
