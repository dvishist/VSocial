import { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/leftbar.scss'
import Follower from './Follower'
axios.defaults.baseURL = require('../../../utils.js/API_URL').API_URL
const imageURL = require('../../../utils.js/API_URL').API_URL + '/users'

export default function Leftbar({user}) {
    const [followers, setFollowers] = useState([])
    const [followings, setFollowings] = useState([])
    const token = localStorage.getItem('token')
    

    useEffect(() => {
        const followingList = user.following.map( async id => {
            const { data } = await axios.get(`/users/${id}`, {
                headers: {
                    'Authorization':`Bearer ${token}`
                }
            })
            return data
        })
        Promise.all(followingList).then(data => {
            setFollowings(data)
        })
        
        const followerList = user.followers.map(async id => {
            const { data } = await axios.get(`/users/${id}`, {
                headers: {
                    'Authorization':`Bearer ${token}`
                }
            })
            return data
        })
        Promise.all(followerList).then(data => {
            setFollowers(data)
        })
    }, [token,user])

    return <div className="leftbar">
        <h2>My Connections</h2>
        <div className="leftbarItems">
            <h3>Followers</h3>
            {followers.length > 0 &&
                followers.map(user => 
                    <Follower key={user._id + 'follower'} img={imageURL + `/${user._id}/profilePicture`} id={user._id} name={ user.username} type='Follower'/>
                )
            }
            <h3>Following</h3>
            {followings.length > 0 &&
                followings.map(user => 
                    <Follower key={ user._id + 'following'} img={imageURL + `/${user._id}/profilePicture`} id={user._id} name={ user.username} type='Following'/>
                )
            }
            </div>
    </div>       
}