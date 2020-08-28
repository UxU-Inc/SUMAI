import React, {useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function EmailCertificationComponent() {
    const location = useLocation()

    useEffect(() => {
        const id=location.search?.slice(1)?.split('id=')[1]?.split('&')[0]
        const cert=location.search?.slice(1)?.split('cert=')[1]?.split('&')[0]
        // console.log(location.search)
        // getID()
        
        axios.post('/api/sendEmail/EmailCertification', {id: id, cert: cert}).then((res) => {
            console.log(res)
        })
    }, [])
    
    return(<p>hi</p>)
}