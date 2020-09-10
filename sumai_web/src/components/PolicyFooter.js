import React, { Component } from 'react'; 
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {createBrowserHistory} from 'history';

const useStyles = theme => ({
    root: {
        background: "#e0e0e0",
        padding: theme.spacing(5),
    },
    text: {
        fontSize: "12px",
        marginRight: "20px",
        textDecoration: "none",
        color: "#666",
        "&:hover": {
            fontWeight: "bold",
            textDecorationLine: 'underline',
        },
    },
    sumaiLink: {
        fontSize: "12px",
        textDecoration: "none",
        color: "#666",
        "&:hover": {
            textDecorationLine: 'underline',
        },
        cursor: "pointer"
    }
});

class PolicyFooter extends Component{ 

    render(){ 
        const { classes } = this.props;

        const browserHistory = createBrowserHistory();
        const link = (url) => (e) => {
          window.location.href=url
          browserHistory.push(url)
        };

        return ( 
            <div className={classes.root}>
                <div>
                    <a href="terms" onClick={link("terms")} className={classes.text}>이용약관</a>
                    <a href="privacy" onClick={link("privacy")} className={classes.text}>개인정보처리방침</a>
                    <a href="notices" onClick={link("notices")} className={classes.text}>공지사항</a>
                </div>
                <div style={{marginTop: "5px"}}>
                    <Typography style={{fontSize: "12px", color: "#666"}}>
                        Copyright © <a href="/" onClick={link("")} className={classes.sumaiLink}>SUMAI</a> All rights reserved.
                    </Typography>
                </div>
            </div>
        ) 
    } 
}

export default withStyles(useStyles)(PolicyFooter);


