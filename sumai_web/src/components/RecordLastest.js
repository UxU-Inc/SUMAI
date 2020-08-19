import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import CryptoJS from 'crypto-js';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';
import { lastestRequest, likeRequest  } from '../actions/mainRecord';

const useStyles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3),
        minWidth: "270px", 
        maxWidth: "1280px", 
        margin: "auto",
    },
    lineTop: {
        paddingTop: 10,
        paddingBottom: 10,
        background: '#ffffff',
        borderTop: '1px solid #e0e0e0',
    },
    cardTitleText: {
        borderBottom: '1px solid #e0e0e0',
        color: '#0000008a',
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
    },
    summaryText: {
        color: "#787878",
        padding: "20px",
        lineHeight: "27px",
        pointerEvents: "none",
        userSelect: "none",
    },
    showExpand: {
    },
    hideExpand: {
        maxHeight: "150px", 
    },
    expandBar: {
        position: 'absolute',
        top: '1', left: '0', right: '0', bottom: '0',
        background: "linear-gradient(rgba( 255, 255, 255, 0.6 ), rgba( 255, 255, 255, 1 ))",
        textAlign:'center',
        transform: 'rotate(0deg)',
        cursor: "pointer",
    },
    expandBarOpen: {
        background: "linear-gradient(rgba( 255, 255, 255, 0 ), rgba( 255, 255, 255, 0 ))",
    },
    expand: {
        padding: "0",
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
});

const references = {
    ref: []
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class RecordLastest extends Component{
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isExpand: [],
            isLowHeight: [],
            windowWidth: undefined,
            dataCount: 10,
            isClick: [],
            notLoginError: false, 
            isAllLoad: false,
            loadingScroll: false,
        }
        references.ref = []
    }
    componentDidMount() {
        this.lastest(-1);
        window.addEventListener('resize', this.handleResize, {once: true})
        window.addEventListener("scroll", this.handleScroll)
    }
    lastest = (idx) => {
        this.props.lastestRequest(idx).then(
            () => {
                if(this.props.lastestStatus === "SUCCESS") {
                    this.setState({
                        data: this.state.data.concat(this.props.lastestData),
                    })
                    if(this.state.data[this.state.data.length-1] && this.state.data[this.state.data.length-1].idx === 1) {
                        this.setState({
                            isAllLoad: true,
                        })
                    }
                }
            }
        );
    }
    like = (sign, idx) => {
        this.props.likeRequest(sign, idx).then(
            () => {
                if(this.props.likeStatus === "SUCCESS") {
                    
                }
            }
        );
    }

    handleResize = () => {
        setTimeout(function() {
            this.setState({
                windowWidth: window.innerWidth
            })
            window.addEventListener('resize', this.handleResize, {once: true})
        }.bind(this), 1000)
    }
    handleScroll = () => {
        const { innerHeight } = window;
        const { scrollHeight } = document.body;
        // IE에서는 document.documentElement 를 사용.
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

        if (this.state.data[this.state.data.length-1] && scrollHeight - innerHeight - scrollTop < 150 && this.state.data[this.state.data.length-1].idx > 1) {
            if(!this.state.loadingScroll){
                console.log("load 10");
                this.setState({
                    dataCount: this.state.dataCount + 10,
                    loadingScroll: true,
                })
                this.lastest(this.state.data[this.state.data.length-1].idx-1);
            }
        } else {
            if(this.state.loadingScroll){
                this.setState({
                    loadingScroll: false
                });
            }
        }
      };
    componentDidUpdate(prevProps, prevState) {
        if(references.ref.length !== this.state.isLowHeight.length || prevState.windowWidth !== this.state.windowWidth) {
            const tempState = []
            references.ref.map( (el, key) => {
                if(this.state.data.length <= key) {
                    return null
                }
                if(el.current.clientHeight <= 217) {
                    tempState.push(true)
                } else {
                    tempState.push(false)
                }
                return null
            })
            this.setState({
                isLowHeight: tempState,
            })
        }
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener("scroll", this.handleScroll)
    }
    onClickExpand = (key) => {
        const tempState = this.state.isExpand.slice()
        tempState[key] = !this.state.isExpand[key]
        this.setState({
            isExpand: tempState,
        })
    }
    onClickChangeColor = (key, idx) => {
        const tempState = this.state.isClick.slice()
        let sign = 1
        tempState[key] = !this.state.isClick[key]
        if(!tempState[key]) {
            sign = -1
        }
        this.like(sign, idx)
        this.setState({
            isClick: tempState,
        })
    }    
    onClickConvertSort = (convert) => {
        if(this.props.lastestStatus !== "WAITING"){
            this.props.convertSortFunction(convert); 
        }
    }
    getOrCreateRef = (key) => {
        if (!references.ref.hasOwnProperty(key)) {
            references.ref[key] = React.createRef();
        }
        return references.ref[key];
    }
    onClickNotLogin = () => {
        this.setState({
            notLoginError: true
        })
    }
    snackBarHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({
            notLoginError: false,
        })
    }
    render(){ 
        const { classes } = this.props
        const list = this.state.data
        return ( 
            <div className={classes.root} > 
                <div className={classes.lineTop}/>
                <Grid container direction="row" style={{justifyContent: "space-between"}}>
                    <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px", marginBottom: "10px"}}>
                        기록2
                    </Typography>
                    <ButtonGroup variant="text" size="large" style={{marginRight: "5px", marginBottom: "10px"}}>
                        <Button color="primary">최신순</Button>
                        <Button onClick={this.onClickConvertSort.bind(this, true)}>추천순</Button>
                    </ButtonGroup>
                </Grid>
                
                {list ? list.slice(0, this.state.dataCount).map( (el, key) => {
                    let re_name = ''
                    let time = el.time.slice(0, 10) + " " + el.time.slice(11, 16)
                    if(/[a-zA-Z]/.test(el.name.charAt(0))) {
                        re_name = el.name.charAt(0)
                    } else if(el.name.length >= 3){
                        if (/[a-zA-Z0-9]/.test(el.name.substring(el.name.length-2, el.name.length))) {
                            re_name = el.name.charAt(0)
                        } else {
                            re_name = el.name.substring(el.name.length-2, el.name.length)
                        }
                    } else {
                        re_name = el.name
                    }
                    return(
                        <Card elevation={5} style={{marginBottom: "10px"}} key={key} ref={this.getOrCreateRef(key)}>
                            <CardHeader avatar={
                                <Avatar style={{backgroundColor: '#' + CryptoJS.MD5(el.name).toString().substring(1, 7), width: "2.2em", height: "2.2em", fontWeight: 'bold'}}>
                                    {re_name}
                                </Avatar>
                            } action={
                                <Grid container direction="row" justify="center">
                                    <Typography style={{fontSize: "20px", paddingTop: "18px"}}>{(el.like) + (this.state.isClick[key]? 1:0)}</Typography>
                                    <IconButton onClick={this.props.isLoggedIn? this.onClickChangeColor.bind(this, key, el.idx): this.onClickNotLogin} style={{marginTop: "4px", marginRight: "4px", marginLeft: "-8px", marginBottom: "-8px"}}>
                                        <ThumbUpAltIcon fontSize="large" color={this.state.isClick[key]? "primary":"inherit"}/>
                                    </IconButton>
                                </Grid>
                                
                            } titleTypographyProps={{variant:'h6' }} title={el.name} subheader={time} className={classes.cardTitleText}/>
                            <CardContent onClick={this.onClickExpand.bind(this, key)} style={{padding: "0px", position: "relative"}}>
                                <Grid container direction="row" className={clsx(classes.showExpand, {[classes.hideExpand]: !this.state.isExpand[key]})}>
                                    <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                                        <Typography className={classes.summaryText}>{el.original_data}</Typography>
                                    </Grid >
                                    <Grid item xs={5} sm={5} md={5} lg={5} xl={5} style={{borderLeft:'1px solid #e0e0e0'}}>
                                        <Typography className={classes.summaryText}>{el.summarize}</Typography>
                                    </Grid >
                                </Grid>
                                <Grid className={clsx(classes.expandBar, {[classes.expandBarOpen]: this.state.isExpand[key]})} style={this.state.isLowHeight[key]? {display: "none"}:null}>
                                    <ExpandMoreIcon className={clsx(classes.expand, {[classes.expandOpen]: this.state.isExpand[key]})} color="action" style={{ fontSize: '45' }} />
                                </Grid>
                            </CardContent>
                        </Card >
                    )
                })
                : null }
                <LinearProgress style={this.state.isAllLoad? {display:"none"} : {marginTop: "20px", marginBottom: "10px"}}/>
                <Snackbar open={this.state.notLoginError} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
                    <Alert onClose={this.snackBarHandleClose} severity="error">
                        로그인을 해주세요.
                    </Alert>
                </Snackbar>
            </div> 
        ) 
    } 
}

RecordLastest.propTypes = {
    isLoggedIn: PropTypes.bool,
};
  
RecordLastest.defaultProps = {
    isLoggedIn: false,
};

const mapStateToProps = (state) => {
    return {
        lastestStatus: state.mainRecord.lastest.status,
        lastestError: state.mainRecord.lastest.error,
        lastestData: state.mainRecord.lastest.data,
        likeStatus: state.mainRecord.like.status,
        likeError: state.mainRecord.like.error
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        lastestRequest: (idx) => {
            return dispatch(lastestRequest(idx));
        },
        likeRequest: (sign, idx) => {
            return dispatch(likeRequest(sign, idx));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(RecordLastest));