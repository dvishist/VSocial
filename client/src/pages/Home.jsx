import Topbar from '../components/home/Topbar'
import Rightbar from '../components/home/rightbar/Rightbar'
import Leftbar from '../components/home/leftbar/Leftbar'
import Feed from '../components/home/feed/Feed'
import './styles/home.scss'
import { useContext, useEffect } from 'react'
import { UserContext } from '../userContext'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
const imageURL = process.env.REACT_APP_API_URL + '/users'
axios.defaults.baseURL = process.env.REACT_APP_API_URL



function isNotMobile() {
  try{ document.createEvent("TouchEvent"); return false; }
  catch(e){ return true; }
}

export default function Home() {
    const {user,setUser} = useContext(UserContext)
    const history = useHistory()

    const verifyUser = async () => {
        const token = localStorage.getItem('token')
        if (!user) {
            if (token) {
                const { data } = await axios.get('/users/self', {
                    headers: {
                        'Authorization':`Bearer ${token}`
                    }
                })
                setUser(data)
            } else {
                history.push('/login')
            }
        }
    }

    useEffect(() => {
        verifyUser()
    }, [])
    
    return <div>
        { user && <Topbar userImg={imageURL + '/' + user._id + '/profilePicture'} />}
        <div className='mainBody'>
            { isNotMobile && <Leftbar/>}
            <Feed />
            { isNotMobile && <Rightbar/>}
        </div>
    </div>
}