import React, { useEffect } from 'react';
import './styling/App.css';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from './Landing';
import Random from './Random';
import Profile from './Profile';
import '../axios.service.ts';
import { getAuthToken, get, setGlobalSetStateMethod } from '../axios.service';
import MenuForm from './forms/MenuForm';
import RecipeForm from './forms/RecipeForm';
import MenuFormatForm from './forms/MenuFormatForm';
import MenuPage from './MenuPage';
import { UserInfo } from '../models';
import LSPopUp from './LSPopUp';
import { Alert, Snackbar } from '@mui/material';


function App() {
  const [isLoggedIn, setLoggedIn] = React.useState(getAuthToken() !== "");
  const [openLSPopUp, setOpenLSPopUp] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState<string | undefined>(undefined);
  const [userInfo, setUserInfo] = React.useState<UserInfo>({ username: "", email: "" });
  setGlobalSetStateMethod("setLoggedIn", setLoggedIn);
  setGlobalSetStateMethod("setUserInfo", setUserInfo);
  setGlobalSetStateMethod("setErrorAlert", setErrorAlert);

  useEffect(() => {
    if (!isLoggedIn) return;
    get('/auth/userInfo', {}, (res) => { setUserInfo({ username: res.data.username, email: res.data.email }) });
  }, [isLoggedIn]);

  const handleLSPopUpClose = () => {
    setOpenLSPopUp(false);
  };

  const handleOpen = () => {
    setOpenLSPopUp(true);
  };

  const handleErrorAlertClose = () => {
    setErrorAlert(undefined);
  };

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
            <Route path='/recipe' element={<RecipeForm />}></Route>
            {isLoggedIn && <Route path='/menu' element={<MenuPage />}></Route>}
            <Route path='*' element={<Navigate to="/" />}></Route>
          </Routes>
        </div>
        <LSPopUp open={openLSPopUp} handleClose={handleLSPopUpClose} />
        <Snackbar open={errorAlert !== undefined} autoHideDuration={6000} onClose={handleErrorAlertClose}>
          <Alert onClose={handleErrorAlertClose} severity="error" sx={{ width: '100%' }}>
            {errorAlert}
          </Alert>
        </Snackbar>
      </Router>
    </div>
  );
}

export default App;
