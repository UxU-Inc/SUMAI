import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';

import { checkSite } from '../functions/CheckSite';
import { returnUrl } from '../functions/util';
const root = checkSite();


const useStyles = theme => ({
    root: {
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        '&::before, &::after': {
            minHeight: '30px',
            height: '24px',
            boxSizing: 'border-box',
            display: 'block',
            content: '""',
            flexGrow: 1,
        },
    },
    rootMob: {
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
    },
    imgLogo: {
        width: root.logoWidth,
        height: root.logoHeight,
        alt: root.site,
    },
    loginMoveButton: {
        variant: 'contained',
        color: '#ffffff',
        background: theme.palette.primary.main,
        "&:hover": {
            background: theme.palette.hover.main
        },
        padding: '0px 30px',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    displayNone: {
        display: "none",
    },
})

function EmailCertificationComponent(props) {
    const location = useLocation()
    const history = useHistory()

    const [email, setEmail] = useState()
    const [comments, setComments] = useState()
    const [code, setCode] = useState(0)

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    const loginUrl = {
        SUMAI: '/login',
        VOI: '/login?url='.concat(returnUrl())
    }

    useEffect(() => {
        const id = location.search?.slice(1)?.split('id=')[1]?.split('&')[0]
        const cert = location.search?.slice(1)?.split('cert=')[1]?.split('&')[0]
        // getID()
        axios.post('/api/email/EmailCertification', { id: id, cert: cert }).then((res) => {
            setEmail(res.data.email)
            setComments(res.data.message)
            setCode(res.data.code)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const { classes } = props;

    return (
        <Box className={(matches ? classes.root : classes.rootMob)}>
            <Box display="flex" alignItems="center" justifyContent="center">
                <img src={root.imgLogo} alt={root.site} className={clsx(classes.imgLogo, { [classes.displayNone]: code === 0 || code === 5 })} style={{ marginRight: "10px" }} />

                <Typography style={{ color: "#0000008A", fontSize: "28px", fontFamily: "NotoSansKR-Regular" }}>
                    {email} {comments}
                </Typography>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="center" className={clsx("none", { [classes.displayNone]: code !== 0 && code !== 5 })}>
                <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />

                <Typography style={{ color: "#0000008A", fontSize: "28px", marginLeft: "10px", fontFamily: "NotoSansKR-Regular" }}>
                    회원가입을 진심으로 환영합니다!
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" mt={2} className={clsx("none", { [classes.displayNone]: code !== 0 && code !== 5 })}>
                <Button className={classes.loginMoveButton} onClick={() => { history.push(loginUrl[root.site]) }}>
                    로그인하기
                </Button>
            </Box>
        </Box>

    )
}

export default withStyles(useStyles)(EmailCertificationComponent);