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
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';
import { lastestRequest, likeRequest  } from '../actions/mainRecord';
import * as root from '../rootValue';
import axios from 'axios'

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
    deleteStyle: {
        margin: "4px 10px -8px -8px",
        cursor: "pointer",
        "&:hover": {
            color: root.PrimaryColor
        },
        "&:active": {
            color: root.HoberColor
        },
    }
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
            isDelete: [],
            deleteCheck: false,
            deleteKey: '',
            deleteIdx: '',
            notLoginError: false, 
            isAllLoad: false,
            loadingScroll: false,
        }
        references.ref = []
    }
    componentDidMount() {
        this.accountInit();
        window.addEventListener('resize', this.handleResize, {once: true})
        window.addEventListener("scroll", this.handleScroll)
        this.unmount = false;
    }
    accountInit = () => {
        new Promise(async (resolve, reject) => {
            const Interval = setInterval(() => {
                if(typeof this.props.status.currentId !== "undefined") {
                    const id = this.props.status.currentId
                    this.lastest(id, -1);
                    resolve();
                    clearInterval(Interval)
                } else if(this.unmount) {
                    resolve();
                    clearInterval(Interval)
                }
            });
        })
      }
    lastest = (id, idx) => {
        this.props.lastestRequest(id, idx).then(
            () => {
                if(this.unmount) {
                    return
                }
                if(this.props.lastest.status === "SUCCESS") {
                    this.setState({
                        data: this.state.data.concat(this.props.lastest.data),
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
    like = (id, sign, idx) => {
        this.props.likeRequest(id, sign, idx).then(
            () => {
                if(this.props.like.status === "SUCCESS") {
                    
                }
            }
        );
    }
    recordDelete = (key, idx) => {
        if(this.state.deleteCheck) {

        } else {
            const tempState = this.state.isDelete.slice()
            tempState[key] = true
            this.setState({
                deleteCheck: true,
                deleteKey: key,
                deleteIdx: idx,
                isDelete: tempState,
            })
        }
        
    }
    recordDeleteCancel = () => {
        const tempState = this.state.isDelete.slice()
        tempState[this.state.deleteKey] = false
        this.setState({
            deleteCheck: false,
            deleteKey: '',
            deleteIdx: '',
            isDelete: tempState,
        })
    }
    handleResize = () => {
        setTimeout(function() {
            if(this.unmount) {
                return
            }
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

        if (this.state.data[this.state.data.length-1] && scrollHeight - innerHeight - scrollTop < 150 && !this.state.isAllLoad) {
            if(!this.state.loadingScroll){
                this.setState({
                    dataCount: this.state.dataCount + 10,
                    loadingScroll: true,
                })
                this.lastest(this.props.status.currentId, this.state.data[this.state.data.length-1].idx-1);
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
        this.unmount = true;
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
    onClickChangeColor = (key, clicked, idx) => {
        const tempState = this.state.isClick.slice()
        tempState[key] = !this.state.isClick[key]
        const sign = clicked === 1? this.state.isClick[key]? 1:-1:this.state.isClick[key]? -1:1
        this.like(this.props.status.currentId, sign, idx)
        this.setState({
            isClick: tempState,
        })
    }    
    onClickConvertSort = () => {
        if(this.props.lastest.status !== "WAITING"){
            setTimeout(function() {
                this.props.convertSortFunction(true)
            }.bind(this), 0);
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
    snackBarDeleteHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        if(this.state.deleteIdx !== '') {
            const idx = this.state.deleteIdx
            this.setState({
                deleteCheck: false,
            })
            axios.post('/api/record/delete', { idx })
            .then((response) => {

            }).catch(() => {

            })
        }
    }
    render(){ 
        const { classes } = this.props
        const list = this.state.data
        return ( 
            <div className={classes.root} > 
                <div className={classes.lineTop}/>
                <Grid container direction="row" style={{justifyContent: "space-between"}}>
                    <Typography style={{color: "#0000008A", fontSize: "28px", marginLeft: "10px", marginBottom: "10px"}}>
                        요약 기록
                    </Typography>
                    <ButtonGroup variant="text" size="large" style={{marginRight: "5px", marginBottom: "10px"}}>
                        <Button color="primary">최신순</Button>
                        <Button onClick={this.onClickConvertSort}>추천순</Button>
                    </ButtonGroup>
                </Grid>
                
                {list ? list.slice(0, this.state.dataCount).map( (el, key) => {
                    const name = el.name || '익명'
                    const image = 'https://sumai-profile.s3.ap-northeast-2.amazonaws.com/image/' + el.image
                    let re_name = ''
                    let time = el.time.slice(0, 10) + " " + el.time.slice(11, 16)
                    if(/[a-zA-Z0-9]/.test(name.charAt(0))) {
                        re_name = name.charAt(0)
                    } else if(name.length >= 3){
                        if (/[a-zA-Z0-9]/.test(name.substring(name.length-2, name.length))) {
                            re_name = name.charAt(0)
                        } else {
                            re_name = name.substring(name.length-2, name.length)
                        }
                    } else {
                        re_name = name
                    }
                    return(
                        <Card elevation={5} style={this.state.isDelete[key]? {display: "none"}:{marginBottom: "10px"}} key={key} ref={this.getOrCreateRef(key)}>
                            <CardHeader avatar={
                                el.image === null?
                                    el.name === null?
                                    <Avatar style={{width: "2.2em", height: "2.2em", fontWeight: 'bold', textTransform: "none"}}>
                                        {re_name}
                                    </Avatar> :
                                <Avatar style={{backgroundColor: '#' + CryptoJS.MD5(el.id).toString().substring(1, 7), width: "2.2em", height: "2.2em", fontWeight: 'bold', textTransform: "none"}}>
                                    {re_name}
                                </Avatar> :
                                <Avatar src={image} style={{width: "2.2em", height: "2.2em"}} />
                            } action={
                                <Grid container direction="row" justify="center" alignItems="center">
                                    {(this.props.status.currentId !== '' && el.id === this.props.status.currentId) || (el.id === '' && el.ip_addr === this.props.ip)?<DeleteIcon onClick={this.recordDelete.bind(this, key, el.idx)} fontSize="large" className={classes.deleteStyle} />: null}
                                    <Typography style={{fontSize: "20px", paddingTop: "18px"}}>{(el.like) + (el.clicked === 1? this.state.isClick[key]? -1:0:this.state.isClick[key]? 1:0)}</Typography>
                                    <IconButton onClick={this.props.status.isLoggedIn? this.onClickChangeColor.bind(this, key, el.clicked, el.idx): this.onClickNotLogin}  style={{margin: "4px 4px -8px -8px"}}>
                                        <ThumbUpAltIcon fontSize="large" color={el.clicked === 1? this.state.isClick[key]? "inherit":"primary":this.state.isClick[key]? "primary":"inherit"}/>
                                    </IconButton>
                                </Grid>
                                
                            } titleTypographyProps={{variant:'h6' }} title={name} subheader={time} className={classes.cardTitleText}/>
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
                <Snackbar open={this.state.deleteCheck} autoHideDuration={3000} onClose={this.snackBarDeleteHandleClose}>
                    <Alert severity="success"
                        action={
                        <Button onClick={this.recordDeleteCancel}color="inherit" size="small">
                            삭제 취소
                        </Button>
                        }>
                        기록이 삭제되었습니다
                    </Alert>
                </Snackbar>
            </div> 
        ) 
    } 
}


const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
        lastest: state.mainRecord.lastest,
        like: state.mainRecord.like,
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        lastestRequest: (id, idx) => {
            return dispatch(lastestRequest(id, idx));
        },
        likeRequest: (id, sign, idx) => {
            return dispatch(likeRequest(id, sign, idx));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(RecordLastest));