import React from 'react';
import RecipeCard from './RecipeCard';
import { alpha, Breadcrumbs, Button, ButtonGroup, Card, CardContent, CardHeader, CardMedia, Chip, Grid, Link, Pagination, Stack, Typography } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { get } from "../axios.service";
import { stringify } from 'querystring';
import { AxiosError, AxiosResponse } from 'axios';
import { ContactSupportOutlined } from '@mui/icons-material';

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

interface random {
    ingredient: string,
    randDrink: Drink | undefined
}

const Random = () => {
    const [randDrink, setRandDrink] = React.useState<Drink | undefined>(undefined);
    const [ingredients, setIngredients] = React.useState<any[]>([]);

    const [drinksByIngredient, setDrinksByIngredient] = React.useState<random[]>([]);

    get(
        "/cocktail_api/ingredient_options", {},
        (res: any) => {
            setIngredients(res.data.drinks);

            ingredients.forEach((ingredient: any) => {
                setDrinksByIngredient(
                    (prev: random[]) => {
                        let obj = [...prev];
                        if (obj.length < ingredients.length) {
                            obj.push({
                                "ingredient": ingredient.strIngredient1,
                                "randDrink": undefined
                            })
                        }
                        return obj;
                    }
                )
            })
        }
    )

    const getRandomDrink = () => {
        get('/cocktail_api/random_drink', {}, (response: AxiosResponse) => {
            console.log(response.data.drinks);
            setRandDrink(response.data.drinks[0]);
        }, (error: AxiosError) => {
            console.log(error);
        });
    }

    const getRandomDrinkByIngredient = (i: string) => {
        get('/cocktail_api/random_drink_by_ingredient', {
            "ingredient": i
        }, (response: AxiosResponse) => {
            const drink = response.data;
            console.log(drink);
            setDrinksByIngredient(
                (prev: random[]) => {
                    let obj = [...prev];
                    let change: random[] = obj.filter(function (x) {
                        return x.ingredient === i
                    });

                    change[0].randDrink = drink;
                    return obj;
                }
            );
            setRandDrink(response.data.drinks[0]);
        }, (error: AxiosError) => {
            console.log(error);
        });
    }

    const getIngredientPhoto = (i: string) => {
        return `https://www.thecocktaildb.com/images/ingredients/${i}-Medium.png`;
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

            <div>
                <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 6, sm: 8, md: 12 }} alignItems="center" justifyContent="center">
                    {drinksByIngredient.map((elem: random, index: number) =>
                        <Grid item xs={4} sm={4} md={2} key={index}>
                            {elem.randDrink ?
                                <RecipeCard data={elem.randDrink} key={index} onClick={() => getRandomDrinkByIngredient(elem.ingredient)} />
                                :
                                <Card sx={{ maxWidth: 345 }} key={index} onClick={() => getRandomDrinkByIngredient(elem.ingredient)}>
                                    <CardHeader title={elem.ingredient} />
                                    <CardMedia
                                        component="img"
                                        height="194"
                                        image={getIngredientPhoto(elem.ingredient)}
                                        alt="Recipe img not available"
                                    />
                                </Card>
                            }
                        </Grid>
                    )}
                </Grid>
            </div>

        </div>
    )
}

export default Random;