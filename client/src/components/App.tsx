import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import LSPopUp from './LSPopUp';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from './Landing';
import Random from './Random';
import MenuForm from './forms/MenuForm';

function App() {
  const [openLogin, setOpenLogin] = React.useState(false);

  const handleClose = () => {
    setOpenLogin(false);
  }

  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Navbar />
          <button color='secondary' onClick={() => {setOpenLogin(true)}}> Log In </button>
          <LSPopUp open={openLogin} handleClose={handleClose} />
        </header>
        <div className="App-body">
          <Routes>
            <Route path='/' element={<Landing />}></Route>
            <Route path='/random' element={<Random />}></Route>
            <Route path='login' element={<Login />}></Route>
            <Route path='signup' element={<Signup />}></Route>
            <Route path='generate' element={<MenuForm />}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
