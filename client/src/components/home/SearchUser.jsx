import React, { useEffect } from 'react'
import _ from 'lodash'
import { Search} from 'semantic-ui-react'
import axios from 'axios'
import '../styles/searchUser.scss'
import { useHistory } from 'react-router-dom'
axios.defaults.baseURL = require('../../utils.js/API_URL').API_URL
const imageURL = require('../../utils.js/API_URL').API_URL + '/users/'

const initialState = {
    loading: false,
    results: [],
    value: '',
}

let users = []

function searchReducer(state, action) {
    switch (action.type) {
        case 'CLEAN_QUERY':
            return initialState
        case 'START_SEARCH':
            return { ...state, loading: true, value: action.query }
        case 'FINISH_SEARCH':
            return { ...state, loading: false, results: action.results }
        case 'UPDATE_SELECTION':
            window.location= './profile?id=' + action.id
            return { ...state, value: action.selection }
        default:
            throw new Error()
    }
}

export default function SearchUser() {
    const history = useHistory()
    
    useEffect(() => {
        async function getUsers() {
            const token = localStorage.getItem('token')
            const responseUsers = await axios.get('/users/all', {
                headers: {
                    'Authorization':`Bearer ${token}`
                }
            })
            users = responseUsers.data.map(user => ({
                id:user.id,
                title: user.username,
                image: imageURL + user.id + '/profilePicture'
            }))
        }
        
        getUsers()
    },[])

    const [state, dispatch] = React.useReducer(searchReducer, initialState)
    const { loading, results, value } = state

    const timeoutRef = React.useRef()
    const handleSearchChange = React.useCallback((e, data) => {
        clearTimeout(timeoutRef.current)
        dispatch({ type: 'START_SEARCH', query: data.value })

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' })
                return
            }

            const re = new RegExp(_.escapeRegExp(data.value), 'i')
            const isMatch = (result) => re.test(result.title)

            dispatch({
                type: 'FINISH_SEARCH',
                results: _.filter(users, isMatch),
            })
        }, 300)
    }, [])
    React.useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    return <Search
        loading={loading}
        onResultSelect={(e, data) =>
            dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title, id:data.result.id, history })
        }
        onSearchChange={handleSearchChange}
        results={results}
        value={value}
    />
}
