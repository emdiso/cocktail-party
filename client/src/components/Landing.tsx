import React from 'react';
import './App.css';
import RecipeCard from './RecipeCard';
import { alpha, Breadcrumbs, Button, ButtonGroup, Chip, Grid, Link, Pagination, Stack, Typography } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { get } from "../axios.service";
import { stringify } from 'querystring';

function Landing() {
  const [isLoading, setLoading] = React.useState(true);
  const [drinks, setDrinks] = React.useState([]);
  const [letter, setLetter] = React.useState("a");

  const update = (l:string) => {
    setLetter(l);
    setLoading(true);
  };

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
      <ButtonGroup size="small" color="secondary">
        <Button onClick={() => update("a")}>a</Button>
        <Button onClick={() => update("b")}>b</Button>
        <Button onClick={() => update("c")}>c</Button>
        <Button onClick={() => update("d")}>d</Button>
      </ButtonGroup>
      <h4>Recipes that start with: {letter}</h4>
      <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 6, sm: 8, md: 12 }}>
        {drinks.map((item, index) => (
          <Grid item xs={4} sm={4} md={2} key={index}>
            <RecipeCard data={item} key={index} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Landing;
