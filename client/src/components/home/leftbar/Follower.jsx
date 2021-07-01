import {Label} from 'semantic-ui-react'

export default function Follower(props) {
    return (
        <div className="follower">
            <a href={`/profile?id=${props.id}`}>
                <img alt='' src={props.img} />
                <span>{props.name}</span>
            </a>
            <label
                style={{
                backgroundColor: props.type === 'Follower' ? 'darkgreen' : 'limegreen'
                }}
            >{props.type}</label>
        </div>
        
    )
}
