import {Label} from 'semantic-ui-react'

export default function Follower(props) {
    return (
        <div className="follower">
            <Label as='a' color='teal' image>
                <img alt='' src={ props.img} />
                <span>{props.name}</span>
                <Label.Detail>{props.type}</Label.Detail>
            </Label>
        </div>
        
    )
}
