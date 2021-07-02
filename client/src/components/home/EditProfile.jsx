import React, { useContext, useEffect, useState } from 'react'
import { Segment, Form,Button, Loader } from 'semantic-ui-react'
import { UserContext } from '../../userContext'
import axios from 'axios'
import FormData from 'form-data'
axios.defaults.baseURL = process.env.REACT_APP_API_URL


export default function EditProfile(props) {
    const [loading, setLoading] = useState(false)
    const { user, setUser } = useContext(UserContext)
    const [formValues, setFormValues] = useState({
        username: '',
        description: '',
        profilePictureName: '',
        coverPictureName: '',
        profilePicture: '',
        coverPicture: ''
    })
    
    const submitForm = async () => {
        setLoading(true)
        const token = localStorage.getItem('token')
        const { username, description, profilePicture, coverPicture } = formValues
        try {
            let updatedUser = {}
            const savedUser = await axios.patch('/users/self', {
                username, description
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            updatedUser = savedUser.data

            if (profilePicture) {
                const profileData = new FormData()
                profileData.append('image', profilePicture)
                const profileSaved = await axios.post('/users/profilePicture', profileData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })          
                updatedUser = profileSaved.data
            }

            if (coverPicture) {
                const coverData = new FormData()
                coverData.append('image', coverPicture)
                const coverSaved = await axios.post('/users/coverPicture', coverData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })          
                updatedUser = coverSaved.data
            }
            setLoading(false)
            setUser(updatedUser)
            props.cancel()
            window.location.reload()
        } catch (err) {
            alert(err.message)
        }
    }

    useEffect(() => {
        user && setFormValues({
            username: user.username,
            description: user.description,
            profilePictureName: '',
            coverPictureName: '',
            profilePicture: '',
            coverPicture: ''
        })
    },[])
    
    return (
        <div className='editProfile'>
            <Segment>
                <Form onSubmit={submitForm}>
                        <Form.Field>
                            <label>Full Name</label>
                            <input
                                required
                                name='username'
                                placeholder='Full Name'
                                value={formValues.username}
                                onChange={e => {
                                    setFormValues(formValues =>({
                                        ...formValues,
                                        username: e.target.value
                                    }))
                                }}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Description</label>
                        <input
                            required
                                name='description'
                                placeholder='Bio'
                                value={formValues.description}
                                onChange={e => {
                                    setFormValues(formValues =>({
                                        ...formValues,
                                        description: e.target.value
                                    }))
                                }}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Change Profile Picture</label>
                            <input
                                value={formValues.profilePictureName}
                                type='file'
                                name='uploadProfile'
                                id='uploadProfile'
                                accept='image/png, image/jpeg'
                                onChange={e => {
                                    setFormValues(formValues => ({
                                        ...formValues,
                                        profilePictureName: e.target.value
                                    }))
                                    setFormValues(formValues => ({
                                        ...formValues,
                                        profilePicture: e.target.files[0]
                                    }))
                                }}
                            />
                    </Form.Field>
                    <Form.Field>
                            <label>Change Cover Picture</label>
                            <input
                                value={formValues.coverPictureName}
                                type='file'
                                name='uploadCover'
                                id='uploadCover'
                                accept='image/png, image/jpeg'
                                onChange={e => {
                                    setFormValues(formValues => ({
                                        ...formValues,
                                        coverPictureName: e.target.value
                                    }))
                                    setFormValues(formValues => ({
                                        ...formValues,
                                        coverPicture: e.target.files[0]
                                    }))
                                }}
                            />
                    </Form.Field>
                    <Button color='facebook' type='submit'>Save Changes</Button>
                    <Button onClick={() => {
                        props.cancel()
                    }}>Cancel</Button>
                </Form>
                {loading && <Loader style={{marginLeft: '38%', marginTop:'2%'}} inline active>Saving Changes..</Loader>}
            </Segment>
        </div>
    )
}
