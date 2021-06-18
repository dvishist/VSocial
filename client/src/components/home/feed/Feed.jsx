import '../../styles/feed.scss'
import Post from './Post'
import FeedItem from './FeedItem'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import relativeDate from 'relative-date'
import { Loader } from 'semantic-ui-react'
import { UserContext } from '../../../userContext'
import { useHistory } from 'react-router-dom'
const token = localStorage.getItem('token')

export default function Feed() {
    const {user,setUser} = useContext(UserContext)
    
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const loadFeed = () => {
        (async () => {
            let { data} = await axios.get('/users/feed', {
                headers: {
                    'Authorization':`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGM5ZDY1NjQ3MjNjOTNlYjBjN2UzN2EiLCJpYXQiOjE2MjQwMDc1OTl9.iILPEJFKSwV9uA6P4_ezC4Qn-n30sY9m0vFLYsWXjUI`    
                }
            })

            data = data.map(async post => {
                const {data} = await axios.get(`/users/${post.userId}`, {
                headers: {
                    'Authorization':`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGM5ZDY1NjQ3MjNjOTNlYjBjN2UzN2EiLCJpYXQiOjE2MjQwMDc1OTl9.iILPEJFKSwV9uA6P4_ezC4Qn-n30sY9m0vFLYsWXjUI`    
                }
            })
                
                return {
                    ...post,
                    user:data
                }
            })
            
            Promise.all(data).then(data => {
                setPosts(data)
                setLoading(false)
            })
        })()

    }

    

    useEffect(() => {
        loadFeed()
    },[])
    
    return <div className="feed">
        <Post />
        {
            loading ?
                <Loader active>Loading Posts</Loader>
            :
            posts.map(post => (
                <FeedItem
                    key={post._id}
                    user={{
                        username: post.user.username,
                        profilePicture: process.env.REACT_APP_API_URL + '/users/'+ post.userId +'/profilePicture'
                    }}
                    post={{
                        ...post,
                        likes: post.likes.length,
                        image: process.env.REACT_APP_API_URL + '/posts/' + post._id + '/image',
                        createdAt: relativeDate(new Date(post.createdAt))
                    }}
                />
            ))
        }
    </div>       
}