import React,{useContext, useEffect, useState} from 'react'
import { Feed,Icon,Image,Segment,Button,Label } from 'semantic-ui-react'
import '../../styles/feedItem.scss'
import { UserContext } from '../../../userContext'
import axios from 'axios'


export default function FeedItem({ postUser,post}) {
    const {user} = useContext(UserContext)
    const [likes, setLikes] = useState(post.likes.length)
    const [isLiked,setLiked] = useState(false)
    const [profileImage, setProfileImage] = useState('')
    const [postImage, setPostImage] = useState('')

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
            console.log('liked')
        } catch (err) {
            console.log(err)
        }
    }

    
    
    
    useEffect(() => {
        const getImages = async () => {
            try {
                const profileImageResponse = await axios.get(`/users/${postUser.id}/profilePicture`)
                
                const postImageResponse = await axios.get(`/posts/${post._id}/image`)
                
                const encodedProfile = 'data:image/png;charset=utf-8;base64, ' + Buffer.from(profileImageResponse.data, 'binary').toString('base64')
                const encodedPost = 'data:image/png;charset=utf-8;base64, ' + Buffer.from(postImageResponse.data, 'binary').toString('base64')

                setProfileImage(encodedProfile)
                setPostImage(encodedPost)
                
            } catch (err) {
                console.log(err.message)
            }
            
        }
        getImages()

        let liked = false
        if (user) liked = post.likes.includes(user._id)
        setLiked(liked)
    },[user, post, postUser])

    return (
        <Segment color='teal'>
            <span className = 'feedInfo'>
                <Feed.Event>
                { profileImage && <img alt='' size='mini' src={profileImage} avatar />}
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
                        {post.description}
                </Feed.Extra>
                <Feed.Extra images>
                    {postImage && <img className='postImage' alt='' src={postImage} />}
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
