import { Input,Button,Icon} from 'semantic-ui-react'
import '../styles/topbar.scss'
import img from '../icons/icon.png'
import User from './User'
import { useHistory } from 'react-router-dom'

export default function Topbar(props) {
    const history = useHistory()
    const logout = () => {
        localStorage.removeItem('token')
        history.push('/login')
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