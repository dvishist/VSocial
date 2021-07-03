import React, { useContext, useEffect, useState } from 'react'
import './styles/login.scss'
import { Form,Button ,Segment,Label,Loader} from 'semantic-ui-react'
import logo from '../components/icons/icon.png'
import axios from 'axios'
import { UserContext } from '../userContext'
import {useHistory} from 'react-router-dom'
const { API_URL } = require('../utils.js/API_URL')
axios.defaults.baseURL=API_URL

const token = localStorage.getItem('token')

export default function Login(props) {
    const history = useHistory()

    const [validEmail, setValidEmail] = useState(true)
    const [validPassword,setValidPassword] = useState(true)
    
    const [validLogin, setValidLogin] = useState(true)
    const [loading,setLoading] = useState(false)

    const { setUser } = useContext(UserContext)

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

        return () => {
            
        }
    },[history])

    const handleFormChange = (e) => {
        setFormValues(currentValues => ({
            ...currentValues,
            [e.target.name] : e.target.value
        }))
        setValidEmail(formValues.email.length > 0)
        setValidPassword(formValues.password.length > 0)
    }

    const submitForm = async (e) => {
        e.preventDefault()
        setValidLogin(true)
        setLoading(true)
        try {
            const { data } = await axios.post('/auth/login', formValues)
            localStorage.setItem('token', data.token)
            setUser(data.user)
            history.push('/')
        } catch (err) {
            setValidLogin(false)
        }
        setLoading(false)
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
                            {!validEmail &&  <Label color='red' pointing>Please enter an Email!</Label>}
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
                            {!validPassword && <Label color='red' pointing>Please enter a Password!</Label>}
                            {!validLogin && <Label color='red' pointing basic >Incorrect Email or Password!</Label> }
                        </Form.Field>
                        <a href='signup'>Don't have an account? Signup</a><br/><br/>
                        <Button positive type='submit'>Login</Button>
                    </Form>
                    {loading && <Loader active inline='centered'>Logging In...</Loader>}
                </Segment>
            </div>
        </div>
    )
}
