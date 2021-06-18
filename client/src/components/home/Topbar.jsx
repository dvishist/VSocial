import { Input,Button,Icon} from 'semantic-ui-react'
import '../styles/topbar.scss'
import img from '../icons/icon.png'
import User from './User'
import userImg from '../icons/user.png'

export default function Topbar() {
    return <div className="container">
        <div className="topbarLeft">
            <Input action='Search' placeholder='Person or Post...' />
        </div>
        <div className="topbarCenter">
            <div className='logo'>
                <h1> <img alt="V" src={img} height='33' width='33'></img>Social</h1>
            </div>
         </div>
         <div className="topbarRight">
             <Button.Group>
                <Button>
                    <Icon name = 'home'></Icon>
                </Button>
                <Button >
                    <Icon name = 'user'></Icon>
                </Button>
            </Button.Group>
            <User userImg={ userImg}/>
        </div>
    </div>
}