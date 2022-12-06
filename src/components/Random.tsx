import React from 'react';
import RecipeCard from './RecipeCard';
import { alpha, Breadcrumbs, Button, ButtonGroup, Card, CardContent, CardHeader, CardMedia, Chip, Grid, Link, Pagination, Stack, Typography } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { get } from "../axios.service";
import { stringify } from 'querystring';
import { AxiosError, AxiosResponse } from 'axios';
import { ContactSupportOutlined } from '@mui/icons-material';
import { Recipe } from "../models"

interface random {
    ingredient: string,
    randDrink: Recipe | undefined
}

const Random = () => {
    const [randDrink, setRandDrink] = React.useState<Recipe | undefined>(undefined);
    const [ingredients, setIngredients] = React.useState<any[]>([]);

    const [drinksByIngredient, setDrinksByIngredient] = React.useState<random[]>([]);
    const [randomDrinksByIngredient, setRandomDrinksByIngredients] = React.useState<random[]>([]);

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
                );
            });

            if (drinksByIngredient.length > 0) {
                setRandomDrinksByIngredients(
                    (prev: random[]) => {
                        let obj = [...prev];
                        if (obj.length < 5) {
                            let diff = 5 - obj.length;
                            for (let i = 0; i < diff; i++) {
                                let randInt = Math.floor(Math.random() * drinksByIngredient.length);
                                if (obj.includes(drinksByIngredient[randInt])) {
                                    i--;
                                } else {
                                    obj.push(drinksByIngredient[randInt]);
                                }
                            }
                        }
                        return obj;
                    }
                );
            }
        }
    )

    const getRandomDrink = () => {
        get('/cocktail_api/random_drink', {}, (response: AxiosResponse) => {
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
            setRandomDrinksByIngredients(
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

    const newIngredients = () => {
        setRandomDrinksByIngredients([]);
        if (drinksByIngredient.length > 0) {
            setRandomDrinksByIngredients(
                (prev: random[]) => {
                    let obj = [...prev];
                    if (obj.length < 5) {
                        let diff = 5 - obj.length;
                        for (let i = 0; i < diff; i++) {
                            let randInt = Math.floor(Math.random() * drinksByIngredient.length);
                            if (obj.includes(drinksByIngredient[randInt])) {
                                i--;
                            } else {
                                obj.push(drinksByIngredient[randInt]);
                            }
                        }
                    }
                    return obj;
                }
            );
        }
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
                <h4>Click for a random drink!</h4>
                <Grid container spacing={{ xs: 2, md: 5 }} columns={{ xs: 6, sm: 8, md: 12 }} alignItems="center" justifyContent="center">
                    {randomDrinksByIngredient ?
                        randomDrinksByIngredient.map((elem: random, index: number) =>
                            <Grid item xs={4} sm={4} md={2} key={index}>
                                {elem.randDrink ?
                                    <RecipeCard data={elem.randDrink} key={index} onClick={() => getRandomDrinkByIngredient(elem.ingredient)} />
                                    :
                                    <Card sx={{ maxWidth: 345 }} key={index} onClick={() => getRandomDrinkByIngredient(elem.ingredient)} style={{ cursor: "pointer" }}>
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
                        )
                        : <h4>Hmm.. I can't find any fun ingredients, sorry</h4>
                    }
                </Grid>
                <Button onClick={newIngredients} variant="contained">New Ingredients</Button>
            </div>
        </div >
    )
}

export default Random;