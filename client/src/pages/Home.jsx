import Topbar from '../components/home/Topbar'
import Rightbar from '../components/home/rightbar/Rightbar'
import Leftbar from '../components/home/leftbar/Leftbar'
import Feed from '../components/home/feed/Feed'
import './styles/home.scss'
import { useContext, useEffect } from 'react'
import { UserContext } from '../userContext'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
axios.defaults.baseURL=process.env.REACT_APP_API_URL
const token = localStorage.getItem('token')

export default function Home(props) {
    const {user,setUser} = useContext(UserContext)
    const history = useHistory()
    
    const verifyUser = async () => {
        if (!user) {
            if (token) {
                const { data } = await axios.get('/users/self', {
                    headers: {
                        'Authorization':`Bearer ${token}`
                    }
                })
                setUser(data.user)   
            } else {
                history.push('/login')
            }
        }
    }

    useEffect(() => {
        verifyUser()
    }, [])
    
    return <div>
        <Topbar />
        <div className='mainBody'>
            <Leftbar />
            <Feed />
            <Rightbar />
        </div>
    </div>
}