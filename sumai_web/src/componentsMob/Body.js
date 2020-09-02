import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import * as root from '../rootValue';

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    background: "#f5f5f5",
    height: "100%",
  },
  cardLayout: {
    display: 'table-cell',
    position: 'relative',
    verticalAlign: 'top',
    width: '50%',
  },
  textTitle: {
      background: "#fff",
      borderBottom: '1px solid #e0e0e0',
      color: '#0000008a',
      padding: '10px 10px 10px 16px',
  },
  textInput: {
      background: '#ffffff',
      width: '100%',
      padding: 0,
      height: '100%',
      lineHeight: '35px',
      minHeight: theme.spacing(12),
      fontSize: '24px',
      fontFamily: 'NotoSansKR-Regular',
      border: 'none',
      outline: 'none',
      resize: 'none',
  },
  summaryLayout: {
      minHeight: theme.spacing(20),
      fontSize: '24px',
      lineHeight: '35px',
  },
  summaryButtonLayout: {
      padding: theme.spacing(0),
  },
  summaryButton: {
      color: '#ffffff',
      background: root.PrimaryColor,
      "&:hover": {
        background: root.HoberColor
      },
      padding: theme.spacing(1),
      margin: "0px 10px 10px 0px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    margin: theme.spacing(0),
  },
  textLimitLayout: {
    position: "fixed",
    fontSize: "14px",
    bottom: 0,
    padding: "14px 14px 14px 20px", 
    background: "#000", 
    opacity: 0.8, 
    color: "#fff",
    width: "100%",
  },
  displayNone: {
    display: "none",
  },
  fab: {
    background: "#fff",
    color: "#00000080",
    position: "fixed",
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    zIndex: "1",
  }
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Body extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        textLimitTag: false,
        summaryLayoutTag: false,
        fabTag: false,
      }
    }
    

    handleChange = (e) => {
      this.props.handleChange(e)
    }

    scrollTop = () => {
      window.scrollTo({top:0, left:0, behavior:'smooth'})
    }

    textRemove = () => {
      this.props.textRemove()
    }

    fetchUsers = async () => {
      if(0 < this.props.state.text.length) {
        this.props.fetchUsers()
      }
    }

    snackBarHandleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      
      this.props.errorSet()
    };

    scrollFab = () => {
      let scrollLine = 100
      if(scrollLine <= document.documentElement.scrollTop && !this.state.fabTag) {
        this.setState({
          fabTag: true
        })
      }
      if(document.documentElement.scrollTop < scrollLine && this.state.fabTag) {
        this.setState({
          fabTag: false
        })
      }
    }

    componentDidMount() {
      this.props.recordFalse()
      window.addEventListener('scroll', this.scrollFab)
    }
    
    componentWillUnmount() {
      window.removeEventListener('scroll', this.scrollFab)
    }

    render() {
        const { classes } = this.props;
        
        return (
          <Box className={classes.root} >

            <Box boxShadow={3} bgcolor="background.paper" mb={0.75}>
              <Typography className={classes.textTitle}>문장 입력</Typography>
                <Box display="flex" style={{padding: 16, background: "#fff"}}>
                  <Box width="100%" >
                    <TextareaAutosize className={classes.textInput} maxLength="5000" style={{fontSize: this.props.state.fontSizeTextArea+'px'}}
                        value={this.props.state.text} onChange={this.handleChange} placeholder={"요약할 내용을 입력하세요."} 
                        onFocus={(e) => e.target.placeholder = ""} onBlur={(e) => e.target.placeholder = "요약할 내용을 입력하세요."} />
                  </Box>
                  <Box pl={0.4} mt={1} mr={-0.25}>
                    <CloseIcon className={clsx("none", {[classes.displayNone]: this.props.state.text.length === 0})} onClick={this.textRemove} style={{color: "#737373"}} />
                  </Box>
                </Box>
                <div style={{height: "50px", background: "#fff", borderBottom: '1px solid #e0e0e0'}}>
                  <IconButton onClick={this.fetchUsers} className={classes.summaryButton} style={{position: "absolute", right: 0}}>
                    <ArrowForwardIcon />
                  </IconButton>
                </div>
            </Box>

            <div className={clsx("none", {[classes.displayNone]: !this.props.state.summaryLayoutTag})}>
            <Box boxShadow={3} bgcolor="background.paper" mt={-0.75} mb={0.75} p={2}>
              <Typography className={classes.summaryLayout} style={{fontSize: this.props.state.fontSizeSummary+'px'}}>
                {this.props.state.summaryText}
              </Typography>
            </Box>

            </div>
            
            <Fab size="small" onClick={this.scrollTop} className={clsx(classes.fab, {[classes.displayNone]: !this.state.fabTag})} >
              <ArrowUpwardIcon />
            </Fab>
                        
            <Backdrop className={classes.backdrop} open={this.props.state.loading}>
              <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar open={this.props.state.error} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
              <Alert style={{position: "absolute", bottom: 10}} onClose={this.snackBarHandleClose} severity="error">
                오류가 발생했습니다.
              </Alert>
            </Snackbar>

            <div style={{minHeight: "50px", background: "#f5f5f5"}}/>

            <Typography className={clsx(classes.textLimitLayout, {[classes.displayNone]: !this.props.state.textLimitTag})}>글자 수 제한: 5000자</Typography> 

          </Box>
          );
    }

}

Body.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Body);
