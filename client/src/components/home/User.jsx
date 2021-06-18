import {Image} from 'semantic-ui-react'

export default function User(props) {
    return (
            <span>
                <Image size='mini' src={props.userImg} avatar />
                <span style={{
                    marginLeft: '9px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    verticalAlign:'middle',
                }}>
                    {props.userName}
                </span>
            </span>
    )
}
