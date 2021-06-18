import Topbar from '../components/home/Topbar'
import Rightbar from '../components/home/rightbar/Rightbar'
import Leftbar from '../components/home/leftbar/Leftbar'
import Feed from '../components/home/feed/Feed'
import './styles/home.scss'
import { useContext, useEffect } from 'react'
import { UserContext } from '../userContext'
import axios from 'axios'

axios.defaults.baseURL=process.env.REACT_APP_API_URL

export default function Home(props) {
    const {user,setUser} = useContext(UserContext)
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log(token)
        if (token) {
            
            (async() => {
                const {data} = await axios.get('/users/self', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                setUser(data)
                console.log(data)
            })()
        } else {
            props.history.push('/login')
        }    
    },[])
 
    return <div>
        <Topbar />
        <div className='mainBody'>
            <Leftbar />
            <Feed />
            <Rightbar />
        </div>
    </div>
}