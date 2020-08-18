import React from 'react'; 
import './Header.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountIcon from '@material-ui/icons/AccountCircle';
import NewsIcon from '@material-ui/icons/ChromeReaderMode';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {createBrowserHistory} from 'history';
import imgLogo from '../images/sumai_logo_blue.png';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(1),
        color: '#0000008A',
    },
    AppBarStyle: {
        paddingTop: "5px",
        paddingBottom: "5px",
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
        padding: theme.spacing(0.5),
        paddingLeft: theme.spacing(5),
        fontSize: 13,
    },
  }));
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
  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);
  
  export default function DenseAppBar() {
    const classes = useStyles();
    
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    
    const [state, setState] = React.useState({
        left: false,
      });
    
      const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
      };

      const browserHistory = createBrowserHistory();
      const link = (url) => (e) => {
        window.location.href=url
        browserHistory.push(url)
      };
    
      const list = (anchor) => (
        <div
          className={clsx(classes.list, {
            [classes.fullList]: anchor === 'top' || anchor === 'bottom',
          })}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
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
          <ListItem button onClick={link("terms")} >
            <ListItemText disableTypography primary="이용약관" className={classes.listText} />
          </ListItem>
          <ListItem button onClick={link("privacy")} >
            <ListItemText disableTypography primary="개인정보처리방침" className={classes.listText} />
          </ListItem>
          <ListItem button onClick={link("notices")} >
            <ListItemText disableTypography primary="공지사항" className={classes.listText} />
          </ListItem>

          <Divider />

          <ListItem button onClick={link("customer")} >
            <ListItemText disableTypography primary="고객센터" className={classes.listText} />
          </ListItem>
          <ListItem button onClick={handleClickOpen}>
            <ListItemText disableTypography primary="의견 보내기" className={classes.listText} />
          </ListItem>
        </List>
        </div>
        
      );
    
    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.AppBarStyle}>
                <Toolbar variant="dense">
                    {['left'].map((anchor) => (
                      <React.Fragment key={anchor}>
                        <IconButton onClick={toggleDrawer(anchor, true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>

                        <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                          {list(anchor)}
                        </Drawer>
                      </React.Fragment>
                    ))}

                    <a href="/" className={classes.link} >
                        <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                    
                        <Typography 
                        style={{
                          color: "#0000008A",
                           fontSize: "28px",
                           marginLeft: "10px",
                           }}>
                            요약
                        </Typography>
                    </a>

                    <div style={{flexGrow: 1}}/>
                      
                    <IconButton style={{marginRight: "10px"}}>
                      <NewsIcon style={{color: "#2196f3"}}/>
                    </IconButton>

                    <Button style={{background: "#2196f3", color: "#fff", padding: "7.5px 15px"}} >
                      <AccountIcon style={{marginRight: "5px"}}/>
                      로그인
                    </Button>
                </Toolbar>

            </AppBar> 
          <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}
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
              minHeight: '200px',
              maxHeight: '250px',
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
        </div>
    );
}