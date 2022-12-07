import React, { useEffect } from 'react';
import './styling/App.css';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './Landing';
import Random from './Random';
import Profile from './Profile';
import '../axios.service.ts';
import { getAuthToken, get } from '../axios.service';
import MenuForm from './forms/MenuForm';
import RecipeForm from './forms/RecipeForm';
import MenuFormatForm from './forms/MenuFormatForm';
import MenuPage from './MenuPage';
import { UserInfo } from '../models';
import LSPopUp from './LSPopUp';


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

  const handleOpen = () => {
    setOpenLogin(true);
  }

  return (
    <div className="App">
      <Router>
        <header>
          <Navbar isLoggedIn={isLoggedIn} handleOpen={handleOpen} userInfo={userInfo} />
        </header>
        <div className="App-body">
          <Routes>
            <Route path='/' element={<Landing />}></Route>
            <Route path='/random' element={<Random />}></Route>
            <Route path='/generate' element={<MenuForm />}></Route>
            <Route path='/wow' element={<MenuFormatForm />}></Route>
            {isLoggedIn && <Route path='/profile' element={<Profile userInfo={userInfo} />}></Route>}
            {isLoggedIn && <Route path='/recipe' element={<RecipeForm />}></Route>}
            {isLoggedIn && <Route path='/menu' element={<MenuPage />}></Route>}
          </Routes>
        </div>
        <LSPopUp open={openLogin} handleClose={handleClose} />
      </Router>
    </div>
  );
}

export default App;
