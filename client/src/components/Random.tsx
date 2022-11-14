import React from 'react';
import './App.css';
import RecipeCard from './RecipeCard';
import { alpha, Breadcrumbs, Button, ButtonGroup, Chip, Grid, Link, Pagination, Stack, Typography } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { get } from "../axios.service";
import { stringify } from 'querystring';
import { AxiosError, AxiosResponse } from 'axios';

// -TODO- On server side, transform the data before returning it to the client, then adjust this interface to match the transformed data
export interface Drink {
    idDrink: string;
    strDrink: string;
    strDrinkAlternate: string;
    strTags: string;
    strVideo: string;
    strCategory: string;
    strIBA: string;
    strAlcoholic: string;
    strGlass: string;
    strInstructions: string;
    strDrinkThumb: string;
    //ingredients: [];
    //measurements: [];
    strImageSource: string;
    strImageAttribution: string;
    strCreativeCommonsConfirmed: string;
    dateModified: string;
}


const Random = () => {
    const [randDrink, setRandDrink] = React.useState<Drink | undefined>(undefined);

    const getRandomDrink = () => {
        get('/cocktail_api/random_drink', {}, (response: AxiosResponse) => {
            console.log(response.data.drinks);
            setRandDrink(response.data.drinks[0]);
        }, (error: AxiosError) => {
            console.log(error);
        });
    }

    return (
        <div>
            <Button onClick={getRandomDrink}> Get Random Cocktail </Button>
            {randDrink !== undefined && (
                <div>
                    <h4>Here's your random cocktail: {randDrink.strDrink}</h4>
                    <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 6, sm: 8, md: 12 }} alignItems="center" justifyContent="center">
                        <Grid item xs={4} sm={4} md={2}>
                            <RecipeCard data={randDrink} />
                        </Grid>
                    </Grid>
                </div>
            )}
        </div>
    )
}

export default Random;