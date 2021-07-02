import Topbar from '../components/home/Topbar'
import Rightbar from '../components/home/rightbar/Rightbar'
import Leftbar from '../components/home/leftbar/Leftbar'
import Feed from '../components/home/feed/Feed'
import './styles/home.scss'
import { useContext, useEffect } from 'react'
import { UserContext } from '../userContext'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
const imageURL = require('../utils.js/API_URL') + '/users'
axios.defaults.baseURL = require('../utils.js/API_URL')
const token = localStorage.getItem('token')



function isNotMobile() {
  try{ document.createEvent("TouchEvent"); return false; }
  catch(e){ return true; }
}

export default function Home() {
    const {user,setUser} = useContext(UserContext)
    const history = useHistory()

    

    useEffect(() => {
        const verifyUser = async () => {
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

        verifyUser()
    }, [history,setUser,user])
    
    return <div>
        { user && <Topbar userImg={imageURL + '/' + user._id + '/profilePicture'} />}
        <div className='mainBody'>
            {isNotMobile && user && <Leftbar user={ user}/>}
            <Feed />
            { isNotMobile && <Rightbar/>}
        </div>
    </div>
}