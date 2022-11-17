import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import LSPopUp from './LSPopUp';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from './Landing';
import Random from './Random';
import '../axios.service.ts';
import { getAuthToken, get, post } from '../axios.service';

export interface UserInfo {
  username: string;
  email: string;
}

function App() {
  let myAuthToken = getAuthToken();
  const [isLoggedIn, setLoggedIn] = React.useState(myAuthToken !== "");
  const [openLogin, setOpenLogin] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<UserInfo>({username:"", email:""});

  if (isLoggedIn) {
    get('/auth/userInfo', {}, (res) => {setUserInfo({username: res.data.username, email: res.data.email})});
  }

  const handleClose = () => {
    setOpenLogin(false);
  }

  const openProfile = () => {
    // -TODO-
  }

  return (
    <div className="App">
      <Router>
        <header className="App-header">

          {isLoggedIn ? 
            <div>
            <button> {userInfo.username} </button>
            </div>
            :
            <div>
              <button color='secondary' onClick={() => {setOpenLogin(true)}}> Log In </button>
              <LSPopUp open={openLogin} handleClose={handleClose} />
            </div>
          }
          <Navbar />
        </header>
        <div className="App-body">
          <Routes>
            <Route path='/' element={<Landing />}></Route>
            <Route path='/random' element={<Random />}></Route>
            <Route path='/profile'></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
