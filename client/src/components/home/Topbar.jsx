import { Input,Button,Icon} from 'semantic-ui-react'
import '../styles/topbar.scss'
import img from '../icons/icon.png'

export default function Topbar() {
    return <div className="container">
        <div className="topbarLeft">
            <Input
                className='searchBox'
                placeholder='Person or Post'                
            />
            <Button color="green" >Search</Button>
        </div>
        <div className="topbarCenter">
            <div className='logo'>
                <h1> <img alt="V" src={img} height='33' width='33'></img>Social</h1>
            </div>
         </div>
         <div className="topbarRight">
             <Button.Group>
                <Button inverted color="green">
                    <Icon name = 'home'></Icon>
                </Button>
                <Button inverted color="green" >
                    <Icon name = 'user'></Icon>
                </Button>
            </Button.Group>
        </div>
    </div>
}