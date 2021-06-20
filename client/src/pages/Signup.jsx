import React, { useState } from 'react'
import './styles/signup.scss'
import { Form,Button ,Segment, Label, Loader} from 'semantic-ui-react'
import img from '../components/icons/icon.png'
import validator from 'validator'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
axios.defaults.baseURL = process.env.REACT_APP_API_URL

export default function Signup() {
    const history = useHistory()
    
    const [loading,setLoading] = useState(false)

    const [validation, setValidation] = useState({
        validEmail: true,
        passwordLength: true,
        passwordMatch: true,
    })

    const [uniqueEmail,setUniqueEmail] = useState(true)
    
    const [formValues, setFormValues] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword:''
    })
        
    const handleChange = e => {
        setFormValues({
            ...formValues,
            [e.target.name] : e.target.value
        })
     
    }

    const signUp = async () => {
        setLoading(true)
        setUniqueEmail(true)

        const validEmail = validator.isEmail(formValues.email)
        const passwordMatch = (formValues.password === formValues.confirmPassword)
        const passwordLength =  formValues.password.length > 7 
        
        setValidation({
            validEmail,
            passwordLength,
            passwordMatch
        })

        if (validEmail && passwordLength && passwordMatch) {
            console.log(formValues)
            try {
                await axios.post('/auth/register', {
                    username: formValues.fullName,
                    email: formValues.email,
                    password: formValues.password
                })
                history.push('/login')
            } catch (err) {
                setUniqueEmail(false)
            }

            setLoading(false)
        } 
            setLoading(false)
            
    }

        return (
        <div className='signupContainer'>
            <div className='signupForm'>
                <Segment>
                    <div className='logo'>
                        <h1> <img alt="V" src={img} height='33' width='33'></img>Social</h1>
                        <h2>Signup</h2>
                    </div>

                    <Form onSubmit={signUp}>
                        <Form.Field>
                            <label>Full Name</label>
                                <input name = 'fullName' value={ formValues.fullName} onChange={handleChange} placeholder='Full Name' />
                        </Form.Field>
                        <Form.Field>
                            <label>Email</label>
                                <input name='email' value={formValues.email} onChange={handleChange} placeholder='Email' />
                                {validation.validEmail || <Label color='red' pointing>Please enter a valid email!</Label>}
                                {uniqueEmail || <Label color='red' pointing>Email address is already taken!</Label>}
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                                <input name='password' value={formValues.password} onChange={handleChange} type='password' placeholder='Password' />
                              { validation.passwordLength || <Label  color='red' pointing>Password must be 8 characters long!</Label>}
                        </Form.Field>
                        <Form.Field>
                            <label>Confirm Password</label>
                                <input name='confirmPassword' value={formValues.confirmPassword} onChange={handleChange} type='password' placeholder='Confirm Password' />
                                { validation.passwordMatch || <Label  color='red' pointing>Passwords do not match!</Label>}
                        </Form.Field>
                         <a href='login'>Already have an account? LogIn</a><br/><br/>
                        <Button positive type='submit'>Signup</Button>
                        {loading && <Loader active inline='centered'>Signing Up</Loader>}
                    </Form>
                </Segment>
            </div>
        </div>
    )
}
