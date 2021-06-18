import React,{useState} from 'react'
import { Feed,Icon,Image,Segment,Button,Label } from 'semantic-ui-react'
import '../../styles/feedItem.scss'

export default function FeedItem(props) {
    const [likes, setLikes] = useState(props.post.likes)
    const [isLiked,setLiked] = useState(false)
    
    const handleLike = () => {
        setLikes(likes => isLiked ? likes - 1 : likes + 1)
        setLiked(isLiked => !isLiked)

        //send like API request
    }

    return (
        <Segment color='teal'>
            <span className = 'feedInfo'>
                <Feed.Event>
                <Image size='mini' src={props.user.profilePicture} avatar />
                    <span style={{
                        marginLeft: '9px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        verticalAlign:'middle',
                    }}>
                    <a href='profile'>{props.user.username}</a>
                    
                    </span>
                    <span>{ props.post.createdAt}</span>
        
                </Feed.Event>
                    
            </span>
            <Feed.Content>
                <Feed.Extra className = 'description' text>
                    { props.post.description}
                </Feed.Extra>
                <Feed.Extra images>
                    { props.post.image && <img className='postImage' alt='' src={props.post.image} />}
                </Feed.Extra>
                <div className='like'>
                    <Button as='div' labelPosition='right'>
                        <Button  color={ isLiked ? 'teal' : 'grey'} onClick={handleLike} icon>
                            {isLiked
                                ? <> <Icon name='thumbs up' /> Liked</>
                                : <> <Icon name='thumbs up outline' /> Like</>
                            }
                            
                        </Button>
                        <Label as='a' onClick={ () => console.log('show likes')} basic >
                            {likes} Likes
                        </Label>
                    </Button>
               </div>
            </Feed.Content>
        </Segment>
    )
}
