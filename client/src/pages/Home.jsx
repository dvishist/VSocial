import Topbar from '../components/home/Topbar'
import Rightbar from '../components/home/Rightbar'
import Leftbar from '../components/home/Leftbar'
import Feed from '../components/home/Feed'
import './styles/home.scss'

export default function Home() {
    return <div>
        <Topbar />
        <div className='mainBody'>
            <Leftbar />
            <Feed />
            <Rightbar />
        </div>
    </div>
}