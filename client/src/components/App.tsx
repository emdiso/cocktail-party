import React, { useEffect } from 'react';
import './styling/App.css';
import LSPopUp from './LSPopUp';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from './Landing';
import Random from './Random';
import Profile from './Profile';
import '../axios.service.ts';
import { getAuthToken, get } from '../axios.service';
import MenuForm from './forms/MenuForm';
import { Fab } from '@mui/material';

export interface UserInfo {
  username: string;
  email: string;
}

function App() {
  let myAuthToken = getAuthToken();
  const [isLoggedIn, setLoggedIn] = React.useState(myAuthToken !== "");
  const [openLogin, setOpenLogin] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<UserInfo>({ username: "", email: "" });

  useEffect(() => {
    if (!isLoggedIn) return;
    get('/auth/userInfo', {}, (res) => { setUserInfo({ username: res.data.username, email: res.data.email }) });
  }, [isLoggedIn]);

  const handleClose = () => {
    setOpenLogin(false);
  }

  return (
    <div className="App">
      <Router>
        <header>
          <Navbar />
          {isLoggedIn ?
            <div style={{position:"absolute", top:"1vw", right:"2vw"}}>
              <Link to="/profile">
                <Fab variant="extended" size="small">
                  {userInfo.username}
                </Fab>
              </Link>
            </div>
            :
            <div style={{position:"absolute", top:"1vw", right:"2vw"}}>
              <Fab variant="extended" onClick={() => { setOpenLogin(true) }} size="small">
                Log In
              </Fab>
              <LSPopUp open={openLogin} handleClose={handleClose} />
            </div>
          }
        </header>
        <div className="App-body">
          <Routes>
            <Route path='/' element={<Landing />}></Route>
            <Route path='/random' element={<Random />}></Route>
            <Route path='/generate' element={<MenuForm />}></Route>
            {isLoggedIn && <Route path='/profile' element={<Profile userInfo={userInfo} />}></Route>}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
