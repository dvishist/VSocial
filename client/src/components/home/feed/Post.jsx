import React, { useContext, useEffect, useState } from 'react'
import { Segment,TextArea,Button,Icon, Loader} from 'semantic-ui-react'
import { UserContext } from '../../../userContext'
import User from '../User'
import axios from 'axios'
import timeGreeting from 'time-greeting'
import FormData from 'form-data'
axios.defaults.baseURL = require('../../../utils.js/API_URL')
const imageURL = require('../../../utils.js/API_URL') + '/users'

export default function Post(props) {
    const {user,setUser} = useContext(UserContext)
    const [fileName, setFileName] = useState('')
    const [file, setFile] = useState('')
    const [postText, setPostText] = useState('')
    const [loading, setLoading] = useState(false)
    
    const submitForm = async () => {
        const token = localStorage.getItem('token')
        setLoading(true)
        if (postText) {
            const data = new FormData()
            data.append('description',postText)
            if(file) data.append('image',file)
            try {
                const response = await axios.post('/posts', data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                props.addPost(response.data)
                setFile('')
                setFileName('')
                setPostText('')
            } catch (err) {
                console.log(err)
            }
        }
        setLoading(false)
    }

    

    useEffect(() => {
        const token = localStorage.getItem('token')
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
        verifyUser()
    }, [user,setUser])

    return (
        <div className = "post">
            <Segment secondary >
                {
                    user &&
                    <>
                        <User userId={user._id} username={user.username} userImg={imageURL + '/' + user._id + '/profilePicture'} />
                        <br/>
                        <TextArea
                            className = 'postText'
                            value={postText}
                            placeholder={timeGreeting() + " " + user.username.split(" ")[0] + ", What's on your mind..."}
                            onChange={e => { setPostText(e.target.value)}}
                        />
                    </>
                }
                
                <br/>
                <Button className='uploadButton' animated>
                    <Button.Content hidden>
                        <input
                            value={fileName}
                            type='file'
                            name='uploadImage'
                            id='uploadImage'
                            accept='image/png, image/jpeg'
                            onChange={e => {
                                setFileName(e.target.value)
                                setFile(e.target.files[0])
                            }}
                        />
                    </Button.Content>
                    <Button.Content visible>
                        <Icon name='photo' />
                    </Button.Content>
                </Button>
                <Button onClick={submitForm} positive>POST</Button>
                {
                    loading &&
                    <Loader active>Posting..</Loader>
                }
            </Segment>
        </div>
    )
}
