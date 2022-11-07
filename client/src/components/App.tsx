import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RecipeCard from './RecipeCard';
import { Grid } from '@mui/material';

export interface RecipeData {
  img: any,
  title: string,
  ingredients: any[],
  recipe: string
}

const dummyPina: RecipeData = {
  img: "https://www.thespruceeats.com/thmb/LI3MXdfPpSL1UbOrcMOXek0u49o=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/frozen-pina-colada-recipe-759297-Hero-1-c53f5c55f6b14b3e8fea901076e4b130.jpg",
  title: "Pina Colada",
  ingredients: ["White Rum", "Coconut Cream", "Pineapple"],
  recipe: "First you do the pina and the colada and then the colada pina pina colada done."
};

const dummyMojito: RecipeData = {
  img: "https://www.thespruceeats.com/thmb/LU-__sp56waXloMZvWpvs5aGDTM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/mojito-cocktail-recipe-759319-hero-01-662400394a744a7fb1f01196ce60c05c.jpg",
  title: "Mojito",
  ingredients: ["White Rum", "Mint", "Lime juice", "Club soda"],
  recipe: "Pre heat the oven and then do this and then add mint and then enjoy your lime."
};

const dummyRecipes: any[] = [
  dummyMojito, dummyPina, dummyMojito, dummyPina
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Navbar />
          <Routes>
            <Route path='login' element={<Login />}></Route>
            <Route path='signup' element={<Signup />}></Route>
          </Routes>
        </Router>
      </header>
      <h4>Recipes</h4>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 8, md: 12 }}>
        {dummyRecipes.map((item, index) => (
          <Grid item xs={4} sm={4} md={4} key={index}>
            <RecipeCard {...item} key={index} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default App;
