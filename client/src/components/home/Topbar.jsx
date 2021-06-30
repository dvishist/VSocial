import { Input,Button} from 'semantic-ui-react'
import '../styles/topbar.scss'
import img from '../icons/icon.png'
import User from './User'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { UserContext } from '../../userContext'
axios.defaults.baseURL = process.env.REACT_APP_API_URL

export default function Topbar(props) {
    const history = useHistory()
    const {user,setUser} = useContext(UserContext)

    const verifyUser = async () => {
        const token = localStorage.getItem('token')
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
                    localStorage.removeItem('token')
                    history.push('/login')
                }
            } else {
                history.push('/login')
            }
        }
    }

    useEffect(() => {
        verifyUser()
    }, [])


    const logout = async () => {
        const token = localStorage.getItem('token')
        await axios.post('/auth/logout', {},{
            headers: {
                'Authorization':`Bearer ${token}`
            }
        })
        window.location = "/login"
        localStorage.removeItem('token')
    }
    
    return <div className="container">
        <div className="topbarLeft">
            <Input action='Search' placeholder='Person or Post...' />
        </div>
        <div className="topbarCenter">
            <div className='logo'>
                <button
                    style={{
                    background: 'none',
                    color: 'inherit',
                    border: 'none',
                    font: 'inherit',
                    cursor: 'pointer',
                    outline: 'inherit',
                }}
                    onClick={()=>{history.push('/')}}
                    
                >
                    <h1> <img alt="V" src={img} height='33' width='33'></img>Social</h1>
                </button>
            </div>
         </div>
         <div className="topbarRight">
            <User userId={user._id} userImg={props.userImg} />
            <Button basic color='green' onClick={logout}>Logout</Button>
        </div>
    </div>
}