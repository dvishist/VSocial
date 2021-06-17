import { Container,Input,Button,Icon} from 'semantic-ui-react'
import './styles/topbar.scss'
import img from './icons/icon.png'
import user from './icons/user.png'

export default function Topbar() {
    return <Container style={{width:'100%'}}>
        <div className="container">
            <div className="topbarLeft">
                <Input className='searchBox' placeholder='Person or Post' />
                <Button color="green" >Search</Button>
            </div>
            <div className="topbarCenter">
                <div className='logo'>
                    <h1> <img alt="V" src={img} height='33' width='33'></img>Social</h1>
                </div>
            </div>
            <div className="topbarRight">
                <Button.Group>
                    <Button color="green">
                        <Icon name = 'home'></Icon>
                    </Button>
                    <Button color="green" >
                        <Icon name = 'user'></Icon>
                    </Button>
                </Button.Group>
            </div>
        </div>
    </Container>
}