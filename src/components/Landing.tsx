import React from 'react';
import RecipeCard from './RecipeCard';
import { alpha, Breadcrumbs, Button, ButtonGroup, Chip, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Link, ListSubheader, Pagination, Stack, Typography } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { get } from "../axios.service";
import { stringify } from 'querystring';
import { AxiosResponse } from 'axios';


function Landing() {
  const [isLoading, setLoading] = React.useState(true);
  const [drinks, setDrinks] = React.useState([]);
  const [letter, setLetter] = React.useState("a");

  const update = (l: string) => {
    setLetter(l);
    setLoading(true);
  };

  if (isLoading) {
    // TODO: handle for when the request doesn't work
    get(
      "/cocktail_api/drinks_by_letter",
      { "letter": letter },
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
        {"abcdefghijklmnopqrstuvwxyz".split("").map((letter: string) => {
          return <Button onClick={() => update(letter)}>{letter}</Button>
        })}
      </ButtonGroup>
      <div style={{ marginTop: "2vw" }}>
        <ImageList sx={{ width: "100%", height: "auto" }}>
          <ImageListItem key="Subheader" cols={7}>
            <ListSubheader component="div">Recipes that start with: {letter.toUpperCase()}</ListSubheader>
          </ImageListItem>
          {drinks.map((item, index) => (
            <RecipeCard data={item} key={index} />
          ))}
        </ImageList>
      </div>
    </div>
  );
}

export default Landing;
