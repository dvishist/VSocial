import '../../styles/feed.scss'
import Post from './Post'
import FeedItem from './FeedItem'
import { useEffect, useState } from 'react'
import axios from 'axios'
import relativeDate from 'relative-date'
import { Loader } from 'semantic-ui-react'

export default function Feed(props) {
    
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const addPost = (post) => {
        setPosts(posts => [post, ...posts])
    }

    const loadFeed = () => {
        (async () => {
            const token = localStorage.getItem('token')

            let { data} = await axios.get('/users/feed', {
                headers: {
                    'Authorization':`Bearer ${token}`
                }
            })
            
            data = data.map(async post => {
                const {data} = await axios.get(`/users/${post.userId}`, {
                headers: {
                    'Authorization':`Bearer ${token}`
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
                posts.length > 0 ? 
                    posts.map(post => (
                        <FeedItem
                            key={post._id}
                            postUser={{
                                id:post.user._id,
                                username: post.user.username,
                                profilePicture: process.env.REACT_APP_API_URL + '/users/'+ post.userId +'/profilePicture'
                            }}
                            post={{
                                ...post,
                                likes: post.likes,
                                image: process.env.REACT_APP_API_URL + '/posts/' + post._id + '/image',
                                createdAt: relativeDate(new Date(post.createdAt))
                            }}
                        />
                    ))
                : <h5>No Posts to Show. Follow people to see Posts</h5>    
        }
    </div>       
}