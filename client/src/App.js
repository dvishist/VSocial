import { useState, useMemo, useContext } from 'react';
import Home from './pages/Home'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile'
import { UserContext } from './userContext';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


function App() {
    const [user, setUser] = useState(useContext(UserContext))
    const providerUser = useMemo(() => ({ user, setUser }), [user, setUser])

    return (
        <Router>
            <UserContext.Provider value={providerUser}>
                <Switch>
                    <Route exact path='/'>
                        <Home />
                    </Route>
                    <Route path='/login'>
                        <Login />
                    </Route>
                    <Route path='/signup'>
                        <Signup />
                    </Route>
                    <Route path='/profile'>
                        <Profile />
                    </Route>
                </Switch>
            </UserContext.Provider>
        </Router>
    );
}

export default App;
