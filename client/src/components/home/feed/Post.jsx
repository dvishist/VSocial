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
                try {
                    const { data } = await axios.get('/users/self', {
                        headers: {
                            'Authorization':`Bearer ${token}`
                        }
                    })
                    setUser(data)
                } catch (err) {
                    console.log(err)
                }
            } 
        }
    }

    useEffect(() => {
        verifyUser()
    }, [])

    return (
        <div className = "post">
            <Segment secondary >
                {
                    user &&
                    <>
                        <User userId={user._id} username={user.username} userImg={imageURL + '/' + user._id + '/profilePicture'} />
                        <br/>
                        <Input style={{ width: '80%' }} size='huge' transparent placeholder={timeGreeting()+ " " + user.username.split(" ")[0]+",   What's on your mind..."} />            
                    </>
                }
                
                <br/>
                <Button className='uploadButton' animated>
                    <Button.Content hidden>
                        <input type='file' name='uploadImage' id='uploadImage' accept='image/png, image/jpeg' ></input>
                    </Button.Content>
                    <Button.Content visible>
                        <Icon name='photo' />
                    </Button.Content>
                </Button>
                <Button positive>POST</Button>
            </Segment>
        </div>
    )
}
