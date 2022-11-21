import React from 'react';
import RecipeCard from './RecipeCard';
import { alpha, Breadcrumbs, Button, ButtonGroup, Chip, Grid, Link, Pagination, Stack, Typography } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { get } from "../axios.service";
import { stringify } from 'querystring';
import { AxiosResponse } from 'axios';


function Landing() {
  const [isLoading, setLoading] = React.useState(true);
  const [drinks, setDrinks] = React.useState([]);
  const [letter, setLetter] = React.useState("a");

  const update = (l:string) => {
    setLetter(l);
    setLoading(true);
  };

  if (isLoading) {
    // TODO: handle for when the request doesn't work
    get(
      "/cocktail_api/drinks_by_letter",
      {"letter": letter},
      (res: AxiosResponse) => {
        setDrinks(res.data.drinks);
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
        { "abcdefghijklmnopqrstuvwxyz".split("").map((letter: string) => {
          return <Button onClick={() => update(letter)}>{letter}</Button>
        })}
      </ButtonGroup>
      <h4>Recipes that start with: {letter.toUpperCase()}</h4>
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
