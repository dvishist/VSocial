import React, { useContext, useEffect } from 'react'
import { Segment,Input,Button,Icon} from 'semantic-ui-react'
import { UserContext } from '../../../userContext'
import User from '../User'
import axios from 'axios'
import timeGreeting from 'time-greeting'
const token = localStorage.getItem('token')
const imageURL = process.env.REACT_APP_API_URL + '/users'

export default function Post(props) {
    const {user,setUser} = useContext(UserContext)

    const verifyUser = async () => {
        if (!user) {
            if (token) {
                const { data } = await axios.get('/users/self', {
                    headers: {
                        'Authorization':`Bearer ${token}`
                    }
                })
                setUser(data)
            } 
        }
    }

    useEffect(() => {
        verifyUser()
    }, [])

    return (
        <div className = "post">
            <Segment secondary color='pink'>
                {
                    
                    user &&
                    <>
                        <User username={user.username} userImg={imageURL + '/' + user._id + '/profilePicture'} />
                        <br/>
                        <Input style={{ width: '80%' }} size='huge' transparent placeholder={timeGreeting()+ " " + user.username.split(" ")[0]+",   What's on your mind..."} />            
                    </>
                }
                
                <br/>
                <Button animated>
                    <Button.Content hidden>Photo</Button.Content>
                    <Button.Content visible>
                        <Icon name='photo' />
                </Button.Content>
                </Button>
                <Button positive>POST</Button>
            </Segment>
        </div>
    )
}
