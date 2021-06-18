import React from 'react'
import './styles/signup.scss'
import { Form,Button ,Segment} from 'semantic-ui-react'
import img from '../components/icons/icon.png'

export default function Signup() {
    return (
        <div className='signupContainer'>

            <div className='signupForm'>
                <Segment>
                    <div className='logo'>
                        <h1> <img alt="V" src={img} height='33' width='33'></img>Social</h1>
                        <h2>Signup</h2>
                    </div>

                    <Form>
                        <Form.Field>
                            <label>Full Name</label>
                            <input placeholder='Full Name' />
                        </Form.Field>
                        <Form.Field>
                            <label>Email</label>
                            <input placeholder='Email' />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input type= 'password' placeholder='Password' />
                        </Form.Field>
                        <Form.Field>
                            <label>Confirm Password</label>
                            <input type= 'password' placeholder='Confirm Password' />
                        </Form.Field>
                         <a href='login'>Already have an account? LogIn</a><br/><br/>
                        <Button positive type='submit'>Signup</Button>
                    </Form>
                </Segment>
            </div>
        </div>
    )
}
