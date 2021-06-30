import { useHistory } from 'react-router-dom'
import {Image} from 'semantic-ui-react'

export default function User(props) {
    const history = useHistory()

    return (
            <span>
            <button
                style={{
                    background: 'none',
                    color: 'inherit',
                    border: 'none',
                    font: 'inherit',
                    cursor: 'pointer',
                    outline: 'inherit',
                }}

                onClick={()=>{history.push('/profile/asd')}}
            >
                    <Image style={{marginTop:'2px'}} size='mini' src={props.userImg} avatar />
                </button>
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
