import {Image} from 'semantic-ui-react'

export default function User(props) {

    return (
            <span>
                <a
                    href={`/profile/?id=${props.userId}`}
                >
                    <Image style={{marginTop:'2px'}} size='mini' src={props.userImg} avatar />
                </a>
                <span style={{
                    marginLeft: '9px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    verticalAlign:'middle',
                }}>
                    {props.username}
                </span>
            </span>
    )
}
