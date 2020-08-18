import React from 'react'; 
import './Header.css';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountIcon from '@material-ui/icons/AccountCircle';
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


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        color: '#0000008A',
    },
    AppBarStyle: {
        maxHeight: "56px",
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
    },
    imgLogo: {
        width: 64,
        height: 22.56,
        alt: 'SUMAI',
    },
    link: {
        display: 'flex',
        alignItems: "center",
        textDecoration: 'none'
    },
    list: {
        width: 264,
    },
    fullList: {
        width: 'auto',
    },
    listText: {
        padding: theme.spacing(0.5),
        paddingLeft: theme.spacing(4),
        fontSize: 13,
    },
  }));
  
  export default function DenseAppBar() {
    const classes = useStyles();
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

                <Typography style={{color: "#0000008A", fontSize: "24px", marginLeft: "8px"}}>
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
          <ListItem button >
            <ListItemText disableTypography primary="의견 보내기" className={classes.listText} />
          </ListItem>
        </List>
        </div>
        
      );
    
    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.AppBarStyle}>
                <Toolbar variant="dense" style={{padding: "0px 10px 0px 20px", flex: 1}}>
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
                    
                        <Typography style={{color: "#0000008A", fontSize: "24px", marginLeft: "8px"}}>
                            요약
                        </Typography>
                    </a>

                    <div style={{flexGrow: 1}}/>

                    <Button style={{background: "#2196f3", color: "#fff", padding: "5px"}} >
                      <AccountIcon style={{marginRight: "5px"}}/>
                      로그인
                    </Button>
                </Toolbar>

            </AppBar> 
        </div>
    );
}