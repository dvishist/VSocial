import React, { useContext } from 'react'
import { Segment,Input,Button,Icon} from 'semantic-ui-react'
import { UserContext } from '../../../userContext'
import userImg from '../../icons/user.png'
import User from '../User'

export default function Post() {
    const {user} = useContext(UserContext)

    return (
        <div className = "post">
            <Segment color='green'>
                <User userName="Vishist" userImg={userImg} />
                <br/>
                <Input style={{width:'80%'}} size='huge' transparent placeholder="What's on your mind..." />
                <br/>
                <Button animated>
                    <Button.Content hidden>Photo</Button.Content>
                    <Button.Content visible>
                        <Icon name='photo' />
                </Button.Content>
                </Button>
                <Button positive>POST</Button>
            </Segment>
        </div>
    )
}
