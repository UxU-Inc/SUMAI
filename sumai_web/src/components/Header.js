/* eslint-disable react-hooks/rules-of-hooks */
import React, { Component, useEffect } from 'react'; 
import { withStyles } from '@material-ui/core/styles';
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
import NewsIcon from '@material-ui/icons/ChromeReaderMode';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import html2canvas from 'html2canvas';


const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
    color: '#0000008A',
  },
  AppBarStyle: {
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
  const {open, setOpen, classes} = props
  const [screen, setScreen] = React.useState(null)

  const screenShot = () => {
    document.getElementById('feedback').hidden = true
    html2canvas(document.body, {removeContainer: false, }).then(function(canvas) {
      // return(canvas)
    // setScreen(document.getElementById('capture').appendChild(canvas))
    document.getElementById('feedback').hidden = false
    setScreen(canvas)
    })
  }
  const showCanvas = () => {
    console.log('미구현')
  }

  useEffect(() => {
    if(screen!==null){
      let t=document.getElementById('screenshotPreview')
      t.src=screen.toDataURL()
      t.height=300

      
      // let context = screen.getContext("2d")
      // context.fillStyle = "#FF0000";
      // context.fillRect(0,0,150,75)
    }
  },[screen])

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog id='feedback' onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}
        style={{
          width: '460px',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            padding: "10px 15px"
          }}>
            의견 보내기
          </DialogTitle>
          <Box
          style={{
            minHeight: '100px',
            maxHeight: '150px',
            display: 'flex',
            padding: "10px 15px"
          }}>
            <TextareaAutosize className={classes.textInput} maxLength="5000" autoFocus={true}
            placeholder="의견을 보내고 싶으신가요? 보내 주신 의견은 소중하게 활용되지만, 민감한 정보는 공유하지 말아 주세요. 궁금하신 점이 있나요? 도움말을 참조하시거나 지원팀에 문의해 보세요."
            style={{
              boxSizing: "border-box",
              flexGrow: 1,
              width: '100%',
              height: 'auto',
              resize: 'none',
              border: 'none',
              outline: 'none',
              font: "400 16px Roboto, RobotoDraft, Helvetica, Arial, sans-serif",
            }}/>
          </Box>
          <Box style={{
            display: 'block',
            background: 'WhiteSmoke',
            padding: '0 10px'
          }}>
            <Box id='screenshotButton' style={{
              display: 'flex',
              width: '400'
            }}>
            <Button onClick={(event) => {
              screenShot()
              document.getElementById('screenshotButton').remove()
            }} 
            style={{
              marginLeft:'auto',
              marginRight:'auto'
            }}>스크린샷 첨부하기</Button>
            </Box>
            <Box style={{
              display: 'flex'
            }}>
              <img id="screenshotPreview" src='' alt='' style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              onClick={showCanvas}
              >
              </img>
            </Box>
          </Box>
          <small
          style={{
            borderTop: '1px solid rgb(224, 224, 224)',
            color: 'rgb(168, 168, 168)',
            backgroundColor: 'rgb(250, 250, 250)',
            font: "12px Roboto, RobotoDraft, Helvetica, Arial, sans-serif",
            padding: "15px 15px"
          }}>
              법적인 이유로 콘텐츠 변경을 요청하려면 법적 도움말 페이지로 이동하세요.
              일부 계정 및 시스템 정보가 UxU에 전송될 수 있습니다. 
              제공해 주신 정보는 개인정보처리방침 및 서비스 약관에 따라 기술 문제를 해결하고 서비스를 개선하는 데 사용됩니다.
          </small>
          <DialogActions
          style={{
            borderTop: '1px solid rgb(224, 224, 224)',
            backgroundColor: 'rgb(250, 250, 250)',
            padding: '5px 15px'
          }}>
            <Button autoFocus onClick={handleClose} color="primary"
            style={{
              
              font: "16px Roboto, RobotoDraft, Helvetica, Arial, sans-serif",
            }}>
              보내기
            </Button>
          </DialogActions>
        </Dialog>
  )
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
                    <MenuItem onClick={handleClose}>계정 관리</MenuItem>
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
    this.props.props.history.push(url)
  }
  getLocation = () => {
    return this.props.props.location.pathname
  }


  
  
  render() { 
    const { classes } = this.props;
    const loginButton = (
      <Button onClick={this.onClickLink("login")} style={this.getLocation() === "/login"? { display: "none" }: { background: "#2196f3", color: "#fff", padding: "7.5px 15px" }}>
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
        <AppBar position="static" className={classes.AppBarStyle}>
          <Toolbar variant="dense">
            {['left'].map((anchor) => (
              <React.Fragment key={anchor}>
                <IconButton onClick={this.toggleDrawer(anchor, true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>

                <Drawer anchor={anchor} open={this.state.anchor} onClose={this.toggleDrawer(anchor, false)}>
                  <div
                    className={clsx(classes.list, {
                      [classes.fullList]: anchor === 'top' || anchor === 'bottom',
                    })}
                    role="presentation"
                    onClick={this.toggleDrawer(anchor, false)}
                    onKeyDown={this.toggleDrawer(anchor, false)}
                  >
                  <ListItem >
                    <a href="/" style={{marginTop: 5, marginLeft: 5}} className={classes.link} >
                      <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 

                      <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px"}}>
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

                      <ListItem button onClick={this.onClickLink("customer")} >
                        <ListItemText disableTypography primary="고객센터" className={classes.listText} />
                      </ListItem>
                      <ListItem button onClick={() => this.dialogOpen(true)}>
                        <ListItemText disableTypography primary="의견 보내기" className={classes.listText} />
                      </ListItem>
                    </List>
                  </div> 
                </Drawer>
              </React.Fragment>
            ))}

            <a href="/" className={classes.link} >
              <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
          
              <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px"}}>
                  요약
              </Typography>
            </a>

            <div style={{flexGrow: 1}}/>

            <IconButton style={{marginRight: "10px"}}>
                <NewsIcon style={{color: "#2196f3"}}/>
            </IconButton>

            {this.props.isLoggedIn ? loginLayout : loginButton}

          </Toolbar>
        </AppBar>

        <FeedbackDialog open={this.state.dialogOpen} setOpen={this.dialogOpen} classes={classes}/>        


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
