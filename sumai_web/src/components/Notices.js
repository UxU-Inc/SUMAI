import React, { Component } from 'react'; 
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import imgLogo from '../images/sumai_logo.png';
import NoticesContents from "./NoticesContents"; 
import PolicyFooter from "./PolicyFooter"; 
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {createBrowserHistory} from 'history';
import Divider from '@material-ui/core/Divider';

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

class Terms extends Component{ 

    render(){ 
        const { classes } = this.props;

        const browserHistory = createBrowserHistory();
        const link = (url) => (e) => {
          window.location.href=url
          browserHistory.push(url)
        };

        return ( 
            <div className={classes.root}>
                <AppBar position="static" className={classes.AppBarStyle}>
                    <Toolbar variant="dense">

                        <a href="/" className={classes.link} >
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                        </a>

                    </Toolbar>
                </AppBar> 

                <div className="Main">
                    
                    <Grid container direction="row" justify="center" style={{marginTop: "16px"}}>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4} style={{marginRight: "-1px"}}>
                        <Button className={classes.button} onClick={link("terms")}>
                          이용약관
                        </Button>
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4} style={{marginRight: "-1px"}}>
                        <Button className={classes.button} onClick={link("privacy")}>
                          개인정보처리방침
                        </Button>
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4} >
                        <Button className={classes.buttonSelect} >
                          공지사항
                        </Button>
                      </Grid>
                    </Grid>

                    <Divider style={{marginTop: "50px", marginBottom: "50px"}}/>

                    <div >
                      <NoticesContents/>
                    </div>
                </div>
                
                <PolicyFooter/>

            </div>
        ) 
    } 
}

export default withStyles(useStyles)(Terms);


