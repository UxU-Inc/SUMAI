import React from 'react';
import axios from 'axios';

class Popup extends React.Component {
    componentDidMount() {
        axios.get('/api/snslogin/google', {headers: {
            'Content-Type': 'application/json'
        }})
                    .then((response) => {
                        console.log(response)
                        // SUCCEED
                    })
    }
    render() {
        return(
            null
        )
    }
}

export default Popup;