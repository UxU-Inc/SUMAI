import React from 'react';
import { withStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Card } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import imgLogo from '../images/SUMAI_logo.png';
import * as root from '../rootValue';


const useStyles = theme => ({
    root: {
        minHeight: '60vh',
        flexDirection: 'column',
        '&::before, &::after': {
            minHeight: '30px',
            height: '24px',
            boxSizing: 'border-box',
            display: 'block',
            content: '""',
            flexGrow: 1,
        },
        display: 'flex',
    },
    card: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    imgLogo: {
        width: 80,
        height: 28.2,
        alt: 'SUMAI',
    },
    imgLogos: {
        width: 128,
        height: 128,
        alt: 'SUMAI',
    },
    cardTitleText: {
        borderBottom: '1px solid #e0e0e0',
        color: '#0000008a',
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
    buttonLayout: {
        // padding: theme.spacing(0),
        padding: '30px 0px 0px 0px',
    },
    blueButton: {
        variant: 'contained',
        color: '#ffffff',
        background: root.PrimaryColor,
        "&:hover": {
            background: root.HoverColor
        },
        width: '100%',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
    },
})

const Header = (props) => {
    const { matches, classes } = props

    return (
        (matches &&
            <Box>
                <Box display="flex" alignItems="center">
                    <a href="https://www.sumai.co.kr">
                        <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} />
                    </a>
                </Box>
            </Box>
        ) || (
            <Box>
                <Box display="flex" >
                    <a href="https://www.sumai.co.kr">
                        <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} />
                    </a>
                </Box>

                <Box display="flex" justifyContent="center" style={{ paddingTop: "10px", paddingBottom: '15px' }}>
                </Box>
            </Box>
        )
    )
}

function EmailLoginComponent(props) {
    const { classes } = props;
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box className={(matches ? classes.root : '')}>
            <Box display="flex" justifyContent="center" style={(!matches ? { minHeight: '100vh' } : {})}>
                <Card elevation={3} className={classes.card} style={(matches ? { display: 'inline-block', maxWidth: '350px', minWidth: '300px', borderRadius: '0px', boxShadow: 'none' } : { padding: '40px 10px 0', borderRadius: '0px', boxShadow: 'none' })}>
                    <Header matches={matches} classes={classes} />
                    <Box style={(matches ? { padding: "16px 0", minHeight: '150px' } : { flex: '1' })}>
                        <Typography style={{ fontFamily: 'NotoSansKR-Regular', color: '#424242', fontSize: '14px', minWidth: '200px' }}>
                            {/* {window.location.href}<br/> */}
                            죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
                        </Typography>
                    </Box>
                </Card>
                {matches &&
                    <img src='https://www.sumai.co.kr/images/logo192.png' alt="SUMAI" className={classes.imgLogos} />
                }
            </Box>
        </Box>
    )

}
export default withStyles(useStyles)(EmailLoginComponent);