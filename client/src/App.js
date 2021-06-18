import { useState, useMemo, useContext } from 'react';
import Home from './pages/Home'
import Login from './pages/Login';
import Signup from './pages/Signup';
import { UserContext } from './userContext';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'


function App() {
    const [user, setUser] = useState(useContext(UserContext))
    const providerUser = useMemo(() => ({ user, setUser }), [user, setUser])

    return (
        <Router>
            <UserContext.Provider value={providerUser}>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
            </UserContext.Provider>
        </Router>
    );
}

export default App;
