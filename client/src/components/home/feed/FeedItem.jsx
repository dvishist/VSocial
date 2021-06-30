import React,{useContext, useEffect, useState} from 'react'
import { Feed,Icon,Image,Segment,Button,Label } from 'semantic-ui-react'
import '../../styles/feedItem.scss'
import axios from 'axios'
import { UserContext } from '../../../userContext'
axios.defaults.baseURL = process.env.REACT_APP_API_URL


export default function FeedItem({ postUser,post}) {
    const {user} = useContext(UserContext)
    
    const [likes, setLikes] = useState(post.likes.length)
    const [isLiked,setLiked] = useState(false)
    
    const handleLike = async () => {
        const token = localStorage.getItem('token')
        setLikes(likes => isLiked ? likes - 1 : likes + 1)
        setLiked(isLiked => !isLiked)
        
        try {
            await axios.patch(`/posts/${post._id}/like`, {},{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        let liked = 0
        if (user) liked = post.likes.includes(user._id)
        setLiked(liked)
    },[])

    return (
        <Segment color='teal'>
            <span className = 'feedInfo'>
                <Feed.Event>
                <Image size='mini' src={postUser.profilePicture} avatar />
                    <span style={{
                        marginLeft: '9px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        verticalAlign:'middle',
                    }}>
                    <a href={`profile/?id=${postUser.id}`}>{postUser.username}</a>
                    
                    </span>
                    <span>{ post.createdAt}</span>
        
                </Feed.Event>
                    
            </span>
            <Feed.Content>
                <Feed.Extra className = 'description' text>
                    { post.description}
                </Feed.Extra>
                <Feed.Extra images>
                    <img className='postImage' alt='' src={post.image} />
                </Feed.Extra>
                <div className='like'>
                    <Button as='div' labelPosition='right'>
                        <Button  color={ isLiked ? 'teal' : 'grey'} onClick={handleLike} icon>
                            {isLiked
                                ? <> <Icon name='thumbs up' /> Liked</>
                                : <> <Icon name='thumbs up outline' /> Like</>
                            }
                            
                        </Button>
                        <Label basic >
                            {likes} Likes
                        </Label>
                    </Button>
               </div>
            </Feed.Content>
        </Segment>
    )
}
