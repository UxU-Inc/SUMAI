/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component } from 'react'; 
import { withStyles, } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import './Header.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import imgLogo from '../images/sumai_logo_blue.png';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';
import * as root from '../rootValue';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import AppsIcon from '@material-ui/icons/Apps';

// import html2canvas from 'html2canvas';
// import emailjs from 'emailjs-com';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { sendAct } from '../reducers/clientInfo';
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
    color: '#0000008A',
  },
  AppBarStyle: {
    background: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
  },
  imgLogo: {
    width: 80,
    height: 28.2,
    alt: 'SUMAI',
  },
  imgLogoMob: {
    width: 64,
    height: 22.56,
    alt: 'SUMAI',
  },
  newsButton: {
    '&:hover': {
      background: "#e3f2fd"
    },
    background: "#fff",
    color: root.PrimaryColor,
    border: '1px solid #d4d4d4',
    marginRight: "10px",
  },
  loginButton: {
    '&:hover': {
      background: root.HoberColor
    },
    background: root.PrimaryColor,
    color: "#fff",
  },
  summaryTypo: {
    color: "#0000008A",
  },
  link: {
    display: 'flex',
    alignItems: "center",
    textDecoration: 'none',
    minWidth: "142px",
  },
  list: {
    width: 280,
  },
  fullList: {
    width: 'auto',
  },
  listText: {
    fontFamily: "NotoSansKR-Regular",
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(5),
    fontSize: 13,
  },


  FeedbackDialogRoot: {
    justifyContent: 'center',
    margin: '0 auto',
  },
  FeedbackDialogContent: {
    display: 'flex',
    padding: "10px 15px",

  },
})



const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'white',
  },
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function FeedbackDialog(props) {
  const {open, setOpen, classes, matches} = props
  // const [screen, setScreen] = React.useState(null)
  const [message, setMessage] = React.useState('')
  
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)

  const [sendEmailButton, setSendEmailButton] = React.useState(true)
  const [sendEmailStatus, setSendEmailStatus] = React.useState(null)

  const dispatch = useDispatch()

  // const screenShot = () => {
  //   document.getElementById('feedback').hidden = true
  //   html2canvas(document.body, {removeContainer: false, }).then(function(canvas) {
  //     // return(canvas)
  //   // setScreen(document.getElementById('capture').appendChild(canvas))
  //   document.getElementById('feedback').hidden = false
  //   setScreen(canvas)
  //   })
  // }
  
  const showCanvas = () => {
    // console.log('미구현')
  }
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const handleMessage = (event) => {
    setMessage(event.target.value)
  }
  function sendEmail(e) {
    setSendEmailButton(false)
    e.preventDefault();
    
    axios.post('/api/Email/sendEmail', {message: message}).then((res) => { // email을 추가하려면 {massage: message, email: 변수}
      setSendEmailStatus(res.status)
      dispatch(sendAct('send feedback is success'))
      setSnackbarOpen(true)
    }, (res) => {
      setSendEmailButton(true)
      setSendEmailStatus(res.status)
      dispatch(sendAct('send feedback is fail'))
      setSnackbarOpen(true)
    });
    handleClose()
  }

  // useEffect(() => {
  //   if(screen!==null){
  //     let t=document.getElementById('screenshotPreview')
  //     t.src=screen.toDataURL()
  //     t.height=300
  //     // let context = screen.getContext("2d")
  //     // context.fillStyle = "#FF0000";
  //     // context.fillRect(0,0,150,75)
  //   }
  // },[screen])

  const handleClose = () => {
    setOpen(false);
    setMessage('');
    setSendEmailButton(true);
  };

  return (
    <Box>
      <Dialog id='feedback' onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullScreen={!matches}
      style={matches?{width: '460px', }:{}} className={classes.FeedbackDialogRoot}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} style={{backgroundColor: root.PrimaryColor, color: 'white', padding: "10px 15px"}}>
          의견 보내기
        </DialogTitle>
        <Box className={classes.FeedbackDialogContent} style={matches?{minHeight: '200px', maxHeight: '250px'}:{height: '100%'}}>
          <TextareaAutosize className={classes.textInput} maxLength="5000" autoFocus={true} onChange={handleMessage}
          placeholder="의견을 보내고 싶으신가요? 보내 주신 의견은 소중하게 활용되지만, 민감한 정보는 공유하지 말아 주세요. 궁금하신 점이 있나요? 지원팀에 문의해 보세요."
          style={{
            boxSizing: "border-box",
            flexGrow: 1,
            width: '100%',
            height: 'auto',
            resize: 'none',
            border: 'none',
            outline: 'none',
            font: "400 16px NotoSansKR-Regular",
          }}/>
        </Box>
        <Box style={{display: 'block', background: 'WhiteSmoke', padding: '0'}}>
          {/* <Box id='screenshotButton' style={{display: 'flex', width: '400'}}>
            <Button onClick={(event) => {
              screenShot()
              document.getElementById('screenshotButton').remove()
            }} style={{marginLeft:'auto', marginRight:'auto', width:'100%', padding:'8px 0'}}>
              스크린샷 첨부하기
            </Button>
          </Box> */}
          <Box style={{display: 'flex'}}>
            <img id="screenshotPreview" src='' alt='' style={{marginLeft: 'auto', marginRight: 'auto',}}onClick={showCanvas} />
          </Box>
        </Box>
        <small
        style={{
          borderTop: '1px solid rgb(224, 224, 224)',
          color: 'rgb(168, 168, 168)',
          backgroundColor: 'rgb(250, 250, 250)',
          font: "12px NotoSansKR-Regular",
          padding: "15px 15px"
        }}>
            일부 계정 및 시스템 정보가 SUMAI에 전송될 수 있습니다. 
            제공해 주신 정보는 개인정보처리방침 및 서비스 약관에 따라 기술 문제를 해결하고 서비스를 개선하는 데 사용됩니다.
        </small>
        <DialogActions
        style={{borderTop: '1px solid rgb(224, 224, 224)', backgroundColor: 'rgb(250, 250, 250)', padding: '5px 15px'}}>
          <Button id='sendEmailButton' autoFocus color="primary" style={{font: "16px NotoSansKR-Regular",}} onClick={sendEmail} disabled={!sendEmailButton}>
            보내기
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar autoHideDuration={3000} open={snackbarOpen} onClose={handleCloseSnackbar}>
        {
          ( sendEmailStatus===200 && 
            <Alert severity={"success"}>
              소중한 의견 감사합니다.
            </Alert>
          ) || (
            <Alert severity={"error"}>
              죄송합니다. 의견 보내기 실패했습니다.
            </Alert>
          )
        }
      </Snackbar>
    </Box>
  )
}


const useStyles2 = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

function MenuListComposition(props) {
  const classes = useStyles2();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  // const { xsm } = props

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const onClickExternLink = (url) => {
    window.location.assign(url)
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);


  function FormRow() {
    return (
      <React.Fragment>
               {/* xs={xsm?4:6} */}
        <Grid item xs={12} >  
          <MenuItem onClick={onClickExternLink.bind(this, "https://news.sumai.co.kr")} style={{width: "100%"}}>
            <div style={{margin: "0 auto"}}>
              <Box> 
                <FeaturedPlayListIcon fontSize="large" style={{color: root.PrimaryColor}}/> 
              </Box>
              <Box> 
                <Typography style={{fontFamily: "NotoSansKR-Regular"}}> 
                  뉴스
                </Typography> 
              </Box>
            </div>
          </MenuItem>
        </Grid>
        {/* <Grid item xs={xsm?4:6}>
          <MenuItem onClick={handleClose} style={{width: "100%"}}>
            <div style={{margin: "0 auto"}}>
              <Box> 
                <FeaturedPlayListIcon fontSize="large" style={{color: root.PrimaryColor}}/> 
              </Box>
              <Box> 
                <Typography style={{fontFamily: "NotoSansKR-Regular"}}> 
                  뉴스
                </Typography> 
              </Box>
            </div>
          </MenuItem>
        </Grid>

      {xsm
      ?
        <Grid item xs={xsm?4:6}>
        <MenuItem onClick={handleClose} style={{width: "100%"}}>
          <div style={{margin: "0 auto"}}>
            <Box> 
              <FeaturedPlayListIcon fontSize="large" style={{color: root.PrimaryColor}}/> 
            </Box>
            <Box> 
              <Typography style={{fontFamily: "NotoSansKR-Regular"}}> 
                뉴스
              </Typography> 
            </Box>
          </div>
        </MenuItem>
      </Grid>
      :
        null
      } */}

      </React.Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <div>
        <IconButton style={{marginRight: "5px"}} 
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}>
          <AppsIcon />
        </IconButton> 
                                                                                               {/* style={{marginRight: xsm?"70px":undefined, zIndex:100}} */}
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{zIndex:100}}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
            >
              <Paper elevation={3} >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                 
                {/* <Grid container spacing={1} style={{width: xsm?"300px":"200px"}}>  */}
                    <Grid container spacing={1} >
                      <Grid container item xs={12}>
                        <FormRow />
                      </Grid>
                      {/* <Grid container item xs={12}>
                        <FormRow />
                      </Grid>
                      <Grid container item xs={12}>
                        <FormRow />
                      </Grid> */}
                    </Grid>

                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}


class Header extends Component{

  constructor(props) {
    super(props)
    this.state = {
      left: false,
      dialogOpen: false,
    }

  }

  dialogOpen = (bool) => {
    this.setState({
      dialogOpen: bool,
    })
  }


  AccountManagementMenu = (props) => {
    
    const [open, setOpen] = React.useState(false);

    const anchorRef = React.useRef(null);
  
    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
  
      setOpen(false);
    };
  
    function handleListKeyDown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    }
  
    // return focus to the button when we transitioned from !open -> open
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const prevOpen = React.useRef(open);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
      }
  
      prevOpen.current = open;
    }, [open]);
  
    return (
      <Box>
        <Box
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          style={{color: "#0000008A", cursor:'pointer'}}
        >
          {props.currentUser}님
          <IconButton style={{padding: "0px"}}>
            <ExpandMoreIcon />
          </IconButton>
        </Box>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={this.onClickLink("accounts")}>계정 관리</MenuItem>
                    <MenuItem onClick={props.onLogout}>로그아웃</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    );
  }

  toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    this.setState({ anchor: open });
  }
  onClickLink = (url) => (e) => {
    this.props.onClickLink(url)
  }
  onClickExternLink = (url) => (e) => {
    window.location.assign(url)
  }

  
  
  render() { 
    
    const { classes } = this.props;
    const loginButton = (
      <Button className={classes.loginButton} onClick={this.onClickLink("/login")} style={this.props.matches?{padding: "7.5px 15px" }:{padding: "5px", minWidth: '80px'}}>
        <AccountIcon style={{marginRight: "5px",}}/>
        로그인
      </Button>
    )
    const loginLayout = (
      <Box display="flex" flexDirection="row" style={{ marginLeft: "auto", color: 'rgba(0, 0, 0, 0.87)'}}>
        <Box p={1}>
          {this.AccountManagementMenu.bind(this, this.props)}
        </Box>
      </Box>
    )
    return ( 
      <div className={classes.root}>
        <AppBar position="static" className={classes.AppBarStyle} style={this.props.matches?{padding: "10px 0px" }:{minWidth: '56px'}}>
          <Toolbar variant="dense" style={this.props.matches?{}:{padding: "0px 10px 0px 20px", flex: 1}}>
            {['left'].map((anchor) => (
              <React.Fragment key={anchor}>
                <IconButton onClick={this.toggleDrawer(anchor, true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>

                <Drawer anchor={anchor} open={this.state.anchor} onClose={this.toggleDrawer(anchor, false)}>

                  {this.props.xsm
                    ?
                    null
                    :
                    <Box display="flex" justifyContent="flex-end" style={{background: "#f5f5f5"}}>
                      <MenuListComposition xsm={this.props.xsm}/>
                    </Box>
                  }
                  
                  <div
                    className={clsx(classes.list, {
                      [classes.fullList]: anchor === 'top' || anchor === 'bottom',
                    })}
                    role="presentation"
                    onClick={this.toggleDrawer(anchor, false)}
                    onKeyDown={this.toggleDrawer(anchor, false)}
                    style={this.props.matches?{}:{width:  '250px'}}
                  >

                  <ListItem >
                    <a href="/" style={{marginTop: 5, marginLeft: 5}} className={classes.link} >
                      <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 

                      <Typography className={classes.summaryTypo} style={{fontSize: "28px", marginLeft: "10px"}}>
                        요약
                      </Typography>
                    </a>
                  </ListItem>
                    <List>
                      <ListItem button onClick={this.onClickLink("terms")} >
                        <ListItemText disableTypography primary="이용약관" className={classes.listText} />
                      </ListItem>
                      <ListItem button onClick={this.onClickLink("privacy")} >
                        <ListItemText disableTypography primary="개인정보처리방침" className={classes.listText} />
                      </ListItem>
                      <ListItem button onClick={this.onClickLink("notices")} >
                        <ListItemText disableTypography primary="공지사항" className={classes.listText} />
                      </ListItem>

                      <Divider />

                      <ListItem button onClick={() => this.dialogOpen(true)}>
                        <ListItemText disableTypography primary="의견 보내기" className={classes.listText} />
                      </ListItem>
                    </List>
                  </div> 
                </Drawer>
              </React.Fragment>
            ))}

            <a href="/" className={classes.link} >
              <img src={imgLogo} alt="SUMAI" className={this.props.matches?classes.imgLogo:classes.imgLogoMob} /> 
          
              <Typography className={classes.summaryTypo} style={this.props.matches?{fontSize: "28px", marginLeft: "10px"}:{fontSize: "24px", marginLeft: "8px"}}>
                  요약
              </Typography>
            </a>

            <div style={{flexGrow: 1}}/>

            {this.props.matches 
            ?  // PC
              <Button className={classes.newsButton} onClick={this.onClickExternLink("https://news.sumai.co.kr")} style={this.props.matches?{padding: "7.5px 15px" }:{padding: "5px", minWidth: '80px'}}>
                <FeaturedPlayListIcon style={{color: root.PrimaryColor, marginRight: "5px"}}/>
                뉴스
              </Button>
            :  // Mobile
              this.props.xsm 
              ?  // Mobile(360~720)
                <MenuListComposition xsm={this.props.xsm}/>
              :  // Mobile(0~360)
                null
            }
            
            {this.props.isLoggedIn ? loginLayout : loginButton}

          </Toolbar>
        </AppBar>

        <FeedbackDialog open={this.state.dialogOpen} setOpen={this.dialogOpen} classes={classes} matches={this.props.matches}/>        

      </div>
    )
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  currentUser: PropTypes.string,
  onLogout: PropTypes.func
};

Header.defaultProps = {
  isLoggedIn: false,
  currentUser: '',
  onLogout: () => { console.error("logout function not defined");}
};

export default withStyles(useStyles)(Header);
