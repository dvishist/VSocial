import { Input,Button} from 'semantic-ui-react'
import '../styles/topbar.scss'
import img from '../icons/icon.png'
import User from './User'
import axios from 'axios'
axios.defaults.baseURL = process.env.REACT_APP_API_URL

export default function Topbar(props) {
    
    const logout = async () => {
        const token = localStorage.getItem('token')
        console.log(token)
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
                <button style={{
                    background: 'none',
                    color: 'inherit',
                    border: 'none',
                    font: 'inherit',
                    cursor: 'pointer',
                    outline: 'inherit',
                }}><h1> <img alt="V" src={img} height='33' width='33'></img>Social</h1>
                </button>
            </div>
         </div>
         <div className="topbarRight">
            <User userImg={props.userImg} />
            <Button basic color='green' onClick={logout}>Logout</Button>
        </div>
    </div>
}