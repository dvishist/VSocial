import Topbar from '../components/home/Topbar'
import UserPictures from '../components/home/UserPictures'
import './styles/profile.scss'
import { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../userContext'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import FeedItem from '../components/home/feed/FeedItem'
import EditProfile from '../components/home/EditProfile'
import relativeDate from 'relative-date'
import { Dimmer, Loader,Button, Label } from 'semantic-ui-react'
const imageURL = process.env.REACT_APP_API_URL + '/users'
axios.defaults.baseURL = process.env.REACT_APP_API_URL

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

    const fetchPosts = async (id,token) => {
        try {
            const res = await axios.get(`/posts/all/${id}`, {
                headers: {
                    'Authorization':`Bearer ${token}`
                }
            })

            const sorted = res.data.reverse()
            setPosts(sorted)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }


    useEffect(() => {
        setLoading(true)
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
    }, [])
    
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
                            {editProfileComponentVisible && <EditProfile cancel={() => {setEditProfileComponentVisible(false)}}/>}
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
                            profilePicture: process.env.REACT_APP_API_URL + '/users/'+ profileUser._id +'/profilePicture'
                        }}
                        post={{
                            ...post,
                                    likes: post.likes,
                                    image: process.env.REACT_APP_API_URL + '/posts/' + post._id + '/image',
                                    createdAt: relativeDate(new Date(post.createdAt))
                        }}
                        />)
                    : <h5>User hasn't posted yet.</h5>    
                }
            </div>
        </div>
}