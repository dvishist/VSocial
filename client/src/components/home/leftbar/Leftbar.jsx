import { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/leftbar.scss'
import Follower from './Follower'
const token = localStorage.getItem('token')
axios.defaults.baseURL = process.env.REACT_APP_API_URL
const imageURL = process.env.REACT_APP_API_URL + '/users'

export default function Leftbar({user}) {
    const [followers, setFollowers] = useState([])
    const [followings, setFollowings] = useState([])
    
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
    }, [])

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
            
            {/* <Follower img='https://react.semantic-ui.com/images/avatar/small/veronika.jpg' name='Tuku' type='Follower' /> */}
        </div>
    </div>       
}