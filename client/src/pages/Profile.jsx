import Topbar from '../components/home/Topbar'
import UserPictures from '../components/home/UserPictures'
import './styles/profile.scss'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../userContext'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import FeedItem from '../components/home/feed/FeedItem'
import EditProfile from '../components/home/EditProfile'
import relativeDate from 'relative-date'
import { Dimmer, Loader,Button, Statistic } from 'semantic-ui-react'
const imageURL = require('../utils.js/API_URL').API_URL + '/users'

export default function Home() {
    const {user,setUser} = useContext(UserContext)
    const history = useHistory()
    const [posts, setPosts] = useState([])
    const [profileUser, setProfileUser] = useState(null)
    const [loading,setLoading] = useState(false)
    const [following, setFollowing] = useState(false)
    const [editProfileComponentVisible, setEditProfileComponentVisible] = useState(false)

    
    const followHandle = () => {
        const token = localStorage.getItem('token')
        const action = following ? 'unfollow' : 'follow'

        axios.patch(`/users/${profileUser._id}/${action}`, {}, {
            headers: {
                'Authorization':`Bearer ${token}`
            }
        })
        setFollowing(following => !following)
        
    }

    

    const fetchPosts = async (id,token) => {
        try {
            const res = await axios.get(`/posts/all/${id}`, {
                headers: {
                    'Authorization':`Bearer ${token}`
                }
            })

            const sorted = res.data.reverse()
            setPosts(sorted)
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        setLoading(true)
        const verifyUser = async (id) => {
        const token = localStorage.getItem('token')
        if (!user) {
            if (token) {
                try {
                    const { data } = await axios.get('/users/self', {
                        headers: {
                            'Authorization':`Bearer ${token}`
                        }
                    })
                    setUser(data)
                    setFollowing ((data.following.find(user => user===id)) ? true : false)
                    fetchPosts(id,token)
                } catch (err) {
                    localStorage.removeItem('token')
                    history.push('/login')
                }
            } else {
                history.push('/login')
            }
        }
    }
        
        const fetchData = async () => {
            const token = localStorage.getItem('token')
            const params = new URLSearchParams(window.location.search)
            const id = Object.fromEntries(params.entries()).id
            try {
                const res = await axios.get(`/users/${id}`, {
                            headers: {
                                'Authorization':`Bearer ${token}`
                            }
                        })
                verifyUser(id)
                setProfileUser(res.data)
            } catch (err) {
                verifyUser(id)
                setProfileUser('None')
            }
           setLoading(false)
        }
        fetchData()
    }, [history,setUser,user])
    
    return profileUser === 'None' ?
        <div>
            {user && <Topbar userImg={imageURL + '/' + user._id + '/profilePicture'} />}
            <h2>Error 404! Profile Not Found.</h2>
        </div>
        : <div className='timelineBody'>
            {user && <Topbar userImg={imageURL + '/' + user._id + '/profilePicture'} />}
            <UserPictures userId={profileUser && profileUser._id} />
            
            <div className='profileBody'>
                <h2>{profileUser && profileUser.username}</h2>
                <p>{profileUser && profileUser.description}</p>
                <div className="stats">
                    <Statistic.Group size='tiny' color='teal'>
                        <Statistic>
                            <Statistic.Value>{profileUser &&  profileUser.followers.length}</Statistic.Value>
                            <Statistic.Label>Followers</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>{ profileUser && profileUser.following.length}</Statistic.Value>
                            <Statistic.Label>Following</Statistic.Label>
                        </Statistic>
                    </Statistic.Group>
                </div>
                {
                    (profileUser && profileUser._id) !== (user && user._id) ?
                        <Button
                            className='followButton'
                            color={following ? 'grey' : 'twitter'}
                            onClick={followHandle}
                        >
                            {following ? 'Unfollow' : 'Follow'}
                        </Button> :
                        <>
                            {!editProfileComponentVisible &&
                                <Button
                                    className='followButton'
                                    onClick={() => {
                                        setEditProfileComponentVisible(true)
                                    }
                                }
                                >Edit Profile</Button>
                            }
                            {editProfileComponentVisible && <EditProfile hide={() => {setEditProfileComponentVisible(false)}}/>}
                        </>
                }
                <br/><br/>
                {loading ?
                    <Dimmer active>
                        <Loader active>Loading Posts</Loader>
                    </Dimmer>
                    
                    :
                    posts.length > 0 ?
                        profileUser && posts && posts.map(post => <FeedItem
                        key={post._id}
                        postUser={{
                            username: profileUser.username,
                            profilePicture: require('../utils.js/API_URL').API_URL + '/users/'+ profileUser._id +'/profilePicture'
                        }}
                        post={{
                            ...post,
                                    likes: post.likes,
                                    image: require('../utils.js/API_URL').API_URL + '/posts/' + post._id + '/image',
                                    createdAt: relativeDate(new Date(post.createdAt))
                        }}
                        />)
                    : <h5>User hasn't posted yet.</h5>    
                }
            </div>
        </div>
}