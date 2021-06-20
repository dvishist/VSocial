import React, { useContext, useEffect, useState } from 'react'
import './styles/login.scss'
import { Form,Button ,Segment} from 'semantic-ui-react'
import logo from '../components/icons/icon.png'
import axios from 'axios'
import { UserContext } from '../userContext'
import {useHistory} from 'react-router-dom'

const token = localStorage.getItem('token')
axios.defaults.baseURL=process.env.REACT_APP_API_URL

export default function Login(props) {
    const history = useHistory()

    const { user, setUser } = useContext(UserContext)

    const [formValues, setFormValues] = useState({
        email: '',
        password:''
    })

    useEffect(() => {
        if (token) {
            axios.get('/users/self', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(data => {
                history.push('/')
            })
        }
    },[])

    const handleFormChange = (e) => {
        setFormValues(currentValues => ({
            ...currentValues,
            [e.target.name] : e.target.value
        }))
    }

    const submitForm = async (e) => {
        e.preventDefault()
        const {data} = await axios.post('/auth/login', formValues)
        if (data) {
            localStorage.setItem('token',data.token)
            setUser(data.user)
            history.push('/')
        }
    }
    
    return (
        <div className='loginContainer'>
            <div className='loginForm'>
                <Segment>
                    <div className='logo'>
                        <h1><img alt="V" src={logo} height='33' width='33'></img>Social</h1>
                        <h2>Login</h2>
                    </div>

                    <Form onSubmit={submitForm}>
                        <Form.Field>
                            <label>Email</label>
                            <input
                                name='email'
                                placeholder='Email'
                                value={formValues.email}
                                onChange={handleFormChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input
                                name='password'
                                type='password'
                                placeholder='Password'
                                value={formValues.password}
                                onChange={handleFormChange}
                            />
                        </Form.Field>
                        <a href='signup'>Don't have an account? Signup</a><br/><br/>
                        <Button positive type='submit'>Login</Button>
                    </Form>
                </Segment>
            </div>
        </div>
    )
}
