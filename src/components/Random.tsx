import React from 'react';
import RecipeCard from './RecipeCard';
import { alpha, Breadcrumbs, Button, ButtonGroup, Card, CardContent, CardHeader, CardMedia, Chip, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Link, ListSubheader, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { baseServerUrl, get } from "../axios.service";
import { stringify } from 'querystring';
import { AxiosError, AxiosResponse } from 'axios';
import { ContactSupportOutlined } from '@mui/icons-material';
import { Recipe } from "../models"

interface random {
    ingredient: string,
    randDrink: Recipe | undefined,
    randDrinkSet: boolean
}

const Random = () => {
    const [randDrink, setRandDrink] = React.useState<Recipe | undefined>(undefined);
    const [once, setOnce] = React.useState<boolean>(false);
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
                                "randDrink": undefined,
                                randDrinkSet: false
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
            setOnce(true);
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
            <ImageListItem key="Subheader">
                <ListSubheader component="div">Any random cocktail</ListSubheader>
            </ImageListItem>
            <ImageList sx={{ width: "100%", height: "auto" }} cols={5}>
                {
                    randDrink ?
                        <div style={{ cursor: "pointer" }} onClick={getRandomDrink}>
                            <RecipeCard data={randDrink} />
                        </div>
                        :
                        <div style={{ cursor: "pointer" }} onClick={getRandomDrink}>
                            <ImageListItem onClick={getRandomDrink} style={{ cursor: "pointer" }}>
                                <img
                                    src="img/default.jpeg"
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    title="*"
                                />
                            </ImageListItem>
                        </div>
                }
            </ImageList>

            <div>
                <ImageListItem key="Subheader">
                    <ListSubheader component="div">Random cocktail by an ingredient</ListSubheader>
                </ImageListItem>
                <ImageList sx={{ width: "100%", height: "auto" }} cols={5}>
                    {randomDrinksByIngredient ?
                        randomDrinksByIngredient.map((elem: random, index: number) =>
                            <div>
                                {elem.randDrink ?
                                    <div onClick={() => getRandomDrinkByIngredient(elem.ingredient)} style={{ cursor: "pointer" }} >
                                        <RecipeCard data={elem.randDrink} key={index} />
                                        <ImageListItemBar
                                            title={elem.ingredient}
                                            position="below"
                                        />
                                    </div>
                                    :
                                    <div onClick={() => getRandomDrinkByIngredient(elem.ingredient)} style={{ cursor: "pointer" }}>
                                        <ImageListItem key={index + 1} >
                                            <img
                                                src={getIngredientPhoto(elem.ingredient)}
                                                loading="lazy"
                                            />
                                            <ImageListItemBar
                                                title={elem.ingredient}
                                            />
                                        </ImageListItem>
                                    </div>
                                }
                            </div>
                        )
                        : <h4>Hmm.. I can't find any fun ingredients, sorry</h4>
                    }
                </ImageList>
                <Button onClick={newIngredients} variant="contained">New Ingredients</Button>
            </div>
        </div >
    )
}

export default Random;