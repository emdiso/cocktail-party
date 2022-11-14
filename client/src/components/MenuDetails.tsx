import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from './Landing';
import { Button, Grid } from '@mui/material';
import { Drink } from './Random';

export interface menu {
  title: string,
  drinks: Drink[] // string of drink ids
}

function MenuDetails() {
  return (
    <div>
      <p>menu details here</p>
    </div>
  );
}

export default MenuDetails;
