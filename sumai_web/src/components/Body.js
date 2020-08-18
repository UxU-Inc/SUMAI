import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import Fab from '@material-ui/core/Fab';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      minHeight: theme.spacing(40),
    },
  },
  cardLayout: {
    display: 'table-cell',
    position: 'relative',
    verticalAlign: 'top',
    width: '50%',
  },
  cardTitleText: {
    borderBottom: '1px solid #e0e0e0',
    color: '#0000008a',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  textInput: {
    background: '#ffffff',
    width: '100%',
    height: '100%',
    lineHeight: '35px',
    minHeight: theme.spacing(20),
    fontSize: '24px',
    fontFamily: 'NotoSansKR-Black',
    border: 'none',
    outline: 'none',
    resize: 'none',
  },
  textLimit: {
    color: "#787878",
    textAlign: "right",
  },
  textLimitAccent: {
    color: "#ED1C24",
    textAlign: "right",
  },
  summaryLayout: {
    minHeight: theme.spacing(29.275),
    fontSize: '24px',
    lineHeight: '35px',
  },
  summaryButtonLayout: {
    padding: theme.spacing(0),
  },
  summaryButton: {
    variant: 'contained',
    color: '#ffffff',
    background: '#2196f3',
    "&:hover": {
      background: "#42a5f5"
    },
    width: '100%',
    height: '50px',
    fontSize: '20px',
    fontWeight: 'bold',
    borderRadius: '0px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    margin: theme.spacing(0),
  },
  displayNone: {
    display: "none",
  },
  fab: {
    background: "#fff",
    color: "#00000080",
    position: "fixed",
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    zIndex: "1",
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Body extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        fabTag: false,
      }
    }

    handleChange = (e) => {
        this.props.handleChange(e)
    }

    onClick = (e) => {
      this.props.onClick(e)
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
      window.addEventListener('scroll', this.scrollFab)
    }
    
    componentWillUnmount() {
      window.removeEventListener('scroll', this.scrollFab)
    }

    render() {
        const { classes } = this.props;

        return (
          <Box style={{backgroundColor: "#fff", color: "#000", padding: "75px 0px"}}>
            <Box display="flex" justifyContent="center">
              <Box style={{width: "640px", marginRight: "5px"}} >
                <Card elevation={3} >
                  <CardHeader title="문장 입력" className={classes.cardTitleText} />
                  <CardContent >
                      <Box display="flex">
                        <TextareaAutosize className={classes.textInput} maxLength="5000" style={{fontSize: this.props.state.fontSizeTextArea+'px'}}
                          autoFocus={true} value={this.props.state.text} onChange={this.handleChange} />
                        <Box pl={0.4} mt={1} mr={-0.25}>
                          <CloseIcon className={clsx("none", {[classes.displayNone]: this.props.state.text.length === 0})} onClick={this.textRemove} style={{color: "#737373"}} />
                        </Box>
                      </Box>
                      <Typography className={clsx(classes.textLimit, {[classes.textLimitAccent]: this.props.state.text.length >= 5000})}>{this.props.state.text.length} / 5000</Typography>
                  </CardContent>
                  <CardActions className={classes.summaryButtonLayout}>
                      <Button onClick={this.fetchUsers} value={this.props.state.text} className={classes.summaryButton}>
                          요약하기
                      </Button>
                  </CardActions>
                </Card >
              </Box >

              <Box style={{width: "640px", marginLeft: "5px"}} >
                <Card elevation={3} > 
                    <CardHeader title="요약" className={classes.cardTitleText} />
                    <CardContent >
                      <Typography className={classes.summaryLayout} style={{fontSize: this.props.state.fontSizeSummary+'px'}}>
                        {this.props.state.summaryText}
                      </Typography>
                    </CardContent>
                </Card >
              </Box >
            </Box>

            <Fab onClick={this.scrollTop} className={clsx(classes.fab, {[classes.displayNone]: !this.state.fabTag})} >
              <ArrowUpwardIcon />
            </Fab>
            
            <Backdrop className={classes.backdrop} open={this.props.state.loading}>
              <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar open={this.props.state.error} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
              <Alert style={{position: "absolute", bottom: 10, width: "220px"}} onClose={this.snackBarHandleClose} severity="error">
                오류가 발생했습니다.
              </Alert>
            </Snackbar>
          </Box>
          );
    }

}

Body.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Body);