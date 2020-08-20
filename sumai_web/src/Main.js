import React from 'react'; 
import './components/Main.css';
import './componentsMob/MainMob.css';

import Header from "./components/Header"; 
import Body from "./components/Body"; 
import RecordLastest from "./components/RecordLastest";
import RecordRecommend from "./components/RecordRecommend";
import HeaderMob from "./componentsMob/Header"; 
import BodyMob from "./componentsMob/Body"; 

import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import axios from 'axios';

import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from './actions/authentication';

class Main extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            text: '',
            summaryText: '',
            fontSizeTextArea: 22,
            fontSizeSummary: 22,
    
            loading: false,
            error: null,
    
            textLimitTag: false,
            summaryLayoutTag: false,
            fabTag: false,

            convertSort: false,
        }
        
    }
    
    convertSortFunction = (convert) => {
        this.setState({
            convertSort: convert
        })
    } 
    handleLogout = () => {
        this.props.logoutRequest().then(
            () => {
                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    email: ''
                };
                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
            }
        );
    }
    componentDidMount() { //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
        // get cookie by name
        function getCookie(name) {
            var value = "; " + document.cookie; 
            var parts = value.split("; " + name + "="); 
            if (parts.length === 2) return parts.pop().split(";").shift();
        }
   
        // get loginData from cookie
        let loginData = getCookie('key');
        // if loginData is undefined, do nothing
        if(typeof loginData === "undefined") return;

        // decode base64 & parse json
        loginData = JSON.parse(atob(loginData));

        // if not logged in, do nothing
        if(!loginData.isLoggedIn) return;
   
        // page refreshed & has a session in cookie,
        // check whether this cookie is valid or not
        this.props.getStatusRequest().then(
            () => {
                console.log(this.props.status)
                // if session is not valid
                if(!this.props.status.valid) {
                    // logout the session
                    loginData = {
                        isLoggedIn: false,
                        email: ''
                    };
   
                    document.cookie='key=' + btoa(JSON.stringify(loginData));
                }
            }
        );
    }

    handleChange = (e) => {
        if(e.target.value.length === 0) {
            this.setState({
                summaryLayoutTag: false,
            })
        }

        if(100 < e.target.value.length) {
            this.setState({
                fontSizeTextArea: 18,
            })
        } else {
            this.setState({
                fontSizeTextArea: 22,
            })
        }

        if(e.target.value.length <= 5000) {
            this.setState({
                text: e.target.value,
                textLimitTag: null,
            })
        } else {
            this.setState({
                text: e.target.value.substring(0, 5000),
            })
        }

        if(e.target.value.length >= 5000) {
            this.setState({
                textLimitTag: true,
            })
        } else {
            this.setState({
                textLimitTag: false,
            })
        }
    }

    onClick = (e) => {
        if(100 < this.state.text.length) {
            this.setState({
              fontSizeSummary: 18,
            })
        } else {
            this.setState({
              fontSizeSummary: 22,
            })
        }
    
        this.setState({
            summaryText: this.state.text,
        })
    
        window.scrollTo({top:0, left:0, behavior:'smooth'})
    }

    textRemove = () => {
        this.setState({
          text: '',
          summaryText: '',
          textLimitTag: false,
          fontSizeTextArea: 22,
          fontSizeSummary: 22,
        })
    }

    fetchUsers = async () => {
        try {
          this.setState({
            error: null,
            summaryText: '',
            loading: true,
          })
          const response = await axios.post(
            'https://bbbnjogjj6.execute-api.us-east-1.amazonaws.com/production',
            {
                summarize: this.state.text
            }
          );
          this.setState({
            summaryText: response.data.summarize,
          })
  
          if(0 < this.state.summaryText.length) {
            this.setState({
              summaryLayoutTag: true,
            })
          } else {
            this.setState({
              summaryLayoutTag: false,
            })
          }
  
        } catch (e) {
          this.setState({
            error: true,
          })
        }
        this.setState({
          loading: false,
        })
    };


    errorSet = () => {
        this.setState({
            error: null,
        })
    }

    render() {
        return ( 
            <div>
                {[''].map( (key) => {
                    return(
                        isWidthUp('md', this.props.width)? 
                        <div key={key}> 
                            <Header isLoggedIn={this.props.status.isLoggedIn} currentUser={this.props.status.currentUser} 
                                    onLogout={this.handleLogout} props={this.props}/> 
                            <div >
                                <Body state={this.state} handleChange={this.handleChange} onClick={this.onClick} 
                                        textRemove={this.textRemove} fetchUsers={this.fetchUsers} errorSet={this.errorSet} />
                            </div>
                        </div> :
                        <div className="MainMob" key={key}> 
                            <HeaderMob isLoggedIn={this.props.status.isLoggedIn} currentUser={this.props.status.currentUser} 
                                    onLogout={this.handleLogout} props={this.props}/> 
                            <div >
                                <BodyMob state={this.state} handleChange={this.handleChange} 
                                        textRemove={this.textRemove} fetchUsers={this.fetchUsers} errorSet={this.errorSet} />
                            </div>
                            
                        </div> 
                    )
                })}
                <div style={isWidthUp('md', this.props.width)? null: {display:"none"}}>
                    {this.state.convertSort? <RecordRecommend convertSortFunction={this.convertSortFunction} isLoggedIn={this.props.status.isLoggedIn}/>:
                    <RecordLastest convertSortFunction={this.convertSortFunction} isLoggedIn={this.props.status.isLoggedIn}/>}
                </div> 
            </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(Main));
