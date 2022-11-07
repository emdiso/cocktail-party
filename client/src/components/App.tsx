import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Cocktail Party
      </header>
      <Router>
        <Navbar />
        <Routes>
          <Route path='login'element={<Login/>}></Route>
          <Route path='signup'element={<Signup/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
