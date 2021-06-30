import React, { useEffect } from 'react'
import '../styles/userPictures.scss'

export default function UserPictures({userId}) {
    const profile = process.env.REACT_APP_API_URL + '/users/' + userId + '/profilePicture'
    const cover = process.env.REACT_APP_API_URL + '/users/' + userId + '/coverPicture'
    
    useEffect(() => {
        
    },[])

    return (
        <div className='picturesContainer'>
            <img className = 'profile' alt ='' src = {profile}></img>
            <img className='cover' alt ='' src = {cover}></img>
        </div>
    )
}
