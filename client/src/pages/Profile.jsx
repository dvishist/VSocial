import Topbar from '../components/home/Topbar'
import UserPictures from '../components/home/UserPictures'
import './styles/profile.scss'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../userContext'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import FeedItem from '../components/home/feed/FeedItem'
const imageURL = process.env.REACT_APP_API_URL + '/users'
axios.defaults.baseURL = process.env.REACT_APP_API_URL



function isNotMobile() {
  try{ document.createEvent("TouchEvent"); return false; }
  catch(e){ return true; }
}

export default function Profile() {
    const {user,setUser} = useContext(UserContext)
    const history = useHistory()
    const [posts, setPosts] = useState([])
    const [loading,setLoading] = useState(true)
    const [profileUser, setProfileUser] = useState(null)

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
            setPosts(res.data)
            console.log(res.data)
        } catch (err) {
            console.log(err)
        }

        
    }


    useEffect(() => {
        
        const fetchData = async () => {
            const token = localStorage.getItem('token')
            const params = new URLSearchParams(window.location.search)
            const id = Object.fromEntries(params.entries()).id
            const res = await axios.get(`/users/${id}`, {
                        headers: {
                            'Authorization':`Bearer ${token}`
                        }
                    })
            
            setProfileUser(res.data)
            verifyUser(id)
        }

        fetchData()
        
    }, [])
    
    return <div>
        {user && <Topbar userImg={imageURL + '/' + user._id + '/profilePicture'} />}
        <UserPictures userId={ user && user._id}/>
        <div className='mainBody'>
            {
               posts.map(post =>  <FeedItem postUser={ profileUser} post={ post}/>)
            }
        </div>
    </div>
}