import React from 'react';
import ReactDOM from 'react-dom';
import './styling/App.css';
import LSPopUp from './LSPopUp';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from './Landing';
import Random from './Random';
import Profile from './Profile';
import '../axios.service.ts';
import { getAuthToken, get, post } from '../axios.service';

export interface UserInfo {
  userId: string;
  username: string;
  email: string;
}

function App() {
  let myAuthToken = getAuthToken();
  const [isLoggedIn, setLoggedIn] = React.useState(myAuthToken !== "");
  const [openLogin, setOpenLogin] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<UserInfo>({userId:"", username:"", email:""});

  if (isLoggedIn) {
    get('/auth/userInfo', {}, (res) => {setUserInfo({userId: res.data.userId, username: res.data.username, email: res.data.email})});
  }

  const handleClose = () => {
    setOpenLogin(false);
  }

  return (
    <div className="App">
      <Router>
        <header className="App-header">

          {isLoggedIn ? 
            <div>
              <Link to="/profile">
                <button> {userInfo.username} </button>
              </Link>
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
            <Route path='/profile' element={<Profile userInfo={userInfo}/>}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
