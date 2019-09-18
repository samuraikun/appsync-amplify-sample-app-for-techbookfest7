import React, { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify'
import { Authenticator } from 'aws-amplify-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import StorehousePage from './pages/StorehousePage';
import Nabvar from './components/Navbar';

export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUserData = async () => {
      const user = await Auth.currentAuthenticatedUser()
      user ? setUser(user) : setUser(null)
    }
    
    getUserData()

    Hub.listen('auth', data => {
      switch(data.payload.event) {
        case 'signIn':
          console.log('login!')
          getUserData()
          break;
        case 'signUp':
          console.log('sign up!')
          break;
        case 'signOut':
          console.log('logout!')
          setUser(null);
          break;
        case 'signIn_failure':
          console.log('signIn failure')
          break;
        case 'configured':
          console.log('configured!')
          break;
        default:
          return
      }
    });
  }, [])

  const handleSignout = async () => {
    try {
      await Auth.signOut();
    } catch(err) {
      console.error('Error signing out user', err);
    }
  }
  
  return !user ? <Authenticator /> : (
    <UserContext.Provider value={user}>
      <Router>
        <>
          {/* Navbar */}
          <Nabvar user={user} handleSignout={handleSignout} />
          {/* Routes */}
          <div className='app-container'>
            <Route exact path='/' component={HomePage} />
            <Route
              path='/storehouses/:storehouseId'
              component={({ match }) => <StorehousePage storehouseId={match.params.storehouseId} />}
            />
          </div>
        </>
      </Router>
    </UserContext.Provider>
  )
}

export default App;
