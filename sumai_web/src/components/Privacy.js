import React, { Component } from 'react'; 
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import imgLogo from '../images/sumai_logo.png';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import {createBrowserHistory} from 'history';
import PrivacyContents from "../components/PrivacyContents"; 
import PolicyFooter from "../components/PolicyFooter"; 
import Box from '@material-ui/core/Box';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

const useStyles = theme => ({
    root: {
        flexGrow: 1,
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
    button: {
        variant: 'contained',
        color: '#666',
        border: '1px solid #d4d4d4',
        width: '100%',
        height: '50px',
        fontSize: '15px',
        borderRadius: '0px',
        
        "&:hover": {
          fontWeight: "bold",
          background: "#ffffff",
          textDecorationLine: 'underline',
        },
    },
    buttonSelect: {
      variant: 'contained',
      color: '#fff',
      border: '1px solid #d4d4d4',
      width: '100%',
      height: '50px',
      fontSize: '15px',
      borderRadius: '0px',
      background: "#1e1e1e",
      
      "&:hover": {
        fontWeight: "bold",
        background: "#1e1e1e",
        textDecorationLine: 'underline',
      },
  },
});

class Privacy extends Component{ 

    render(){ 
        const { classes } = this.props;

        const browserHistory = createBrowserHistory();
        const link = (url) => (e) => {
          window.location.href=url
          browserHistory.push(url)
        };


        /**************************************************** PC *****************************************************/
        if(isWidthUp('md', this.props.width)) {
          return ( 
              <div className={classes.root}>
                  <AppBar position="static" className={classes.AppBarStyle}>
                      <Toolbar variant="dense">

                          <a href="/" className={classes.link} >
                              <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                          </a>

                      </Toolbar>
                  </AppBar> 

                  <div style={{backgroundColor: "#fff", padding: "50px 10%", minWidth: "300px"}}>

                      <Box display="flex" justifyContent="center">
                        <Box flexGrow={1} style={{marginRight: "-1px"}}>
                          <Button className={classes.button} onClick={link("terms")}>
                            이용약관
                          </Button>
                        </Box>
                        <Box flexGrow={1} style={{marginRight: "-1px"}}>
                          <Button className={classes.buttonSelect}>
                            개인정보처리방침
                          </Button>
                        </Box>
                        <Box flexGrow={1}>
                          <Button className={classes.button} onClick={link("notices")}>
                            공지사항
                          </Button>
                        </Box>
                      </Box>

                      <Divider style={{marginTop: "50px", marginBottom: "50px"}}/>

                      <PrivacyContents/>
                  </div>
                  
                  <PolicyFooter/>

              </div>
          ) 
        }


        /*************************************************** 모바일 ***************************************************/
        else {
          return ( 
            <div className={classes.root}>
                <AppBar position="static" className={classes.AppBarStyle}>
                    <Toolbar variant="dense">

                        <a href="/" className={classes.link} >
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                        </a>

                    </Toolbar>
                </AppBar> 

                <div style={{backgroundColor: "#fff", margin: "-1px -1px 0px -1px"}}>
                    
                    <Box display="flex" justifyContent="center">
                      <Box flexGrow={1} style={{marginRight: "-1px"}}>
                        <Button className={classes.button} onClick={link("terms")}>
                          이용약관
                        </Button>
                      </Box>
                      <Box flexGrow={1} style={{marginRight: "-1px"}}>
                        <Button className={classes.buttonSelect} >
                          개인정보처리방침
                        </Button>
                      </Box>
                      <Box flexGrow={1} >
                        <Button className={classes.button} onClick={link("notices")}>
                          공지사항
                        </Button>
                      </Box>
                    </Box>

                    <div style={{padding: "20px"}}>
                        <PrivacyContents/>
                    </div>
                </div>
                
            </div>
        )
      }


    } 
}

export default withStyles(useStyles)(withWidth()(Privacy));


