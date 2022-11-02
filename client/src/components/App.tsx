import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import { Router } from 'express';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Cocktail Party
      </header>
      <div>
        <Link to='/'>
          <button color='secondary'> Home </button>
        </Link>
        <button color='secondary'> Random </button>
        <button color='secondary'> Generate </button>
        <button color='secondary'> Random </button>
        <Link to='login'>
          <button color='secondary'> Log In </button>
        </Link>
        <Link to='signup'>
          <button color='secondary'> Sign Up </button>
        </Link>
      </div>
      <Routes>
        <Route path='/' element={<App/>}>
          <Route path='login'element={<Login/>}></Route>
          <Route path='signup'element={<Signup/>}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
