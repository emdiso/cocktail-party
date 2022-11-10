import React from 'react';
import './App.css';
import RecipeCard from './RecipeCard';
import { Breadcrumbs, Grid, Link, Pagination, Stack, Typography } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { get } from "../axios.service";

function Landing() {
  const [isLoading, setLoading] = React.useState(true);
  const [drinks, setDrinks] = React.useState([]);
  const [letter, setLetter] = React.useState("a");

  if (isLoading) {
    const data = get("/drinks_by_letter", {
      "letter": letter
    }).then(
      (res: any) => {
        setDrinks(res.drinks);
        setLoading(false);
      }
    );

    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h4>Recipes that start with: {letter}</h4>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 8, md: 12 }}>
        {drinks.map((item, index) => (
          <Grid item xs={4} sm={4} md={4} key={index}>
            <RecipeCard data={item} key={index} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Landing;
