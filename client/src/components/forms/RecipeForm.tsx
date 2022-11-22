import React, { useEffect, useRef, useState } from 'react';
import { Button, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Slider, TextField } from '@mui/material';
import { get, post } from '../../axios.service';
import { Axios, AxiosResponse } from 'axios';
import './../styling/App.css';
import { Label } from '@mui/icons-material';
import { Drink } from './../Random';
import './../styling/RecipeForm.css';

const RecipeForm = () => {
    const [values, setValues] = React.useState<Drink>({
        idDrink: '',
        strDrink: '',
        strDrinkAlternate: '',
        strTags: '',
        strVideo: '',
        strCategory: '',
        strIBA: '',
        strAlcoholic: '',
        strGlass: '',
        strInstructions: '',
        strDrinkThumb: '',
        strIngredient1: '',
        strIngredient2: '',
        strIngredient3: '',
        strIngredient4: '',
        strIngredient5: '',
        strIngredient6: '',
        strIngredient7: '',
        strIngredient8: '',
        strIngredient9: '',
        strIngredient10: '',
        strIngredient11: '',
        strIngredient12: '',
        strIngredient13: '',
        strIngredient14: '',
        strIngredient15: '',
        strMeasure1: '',
        strMeasure2: '',
        strMeasure3: '',
        strMeasure4: '',
        strMeasure5: '',
        strMeasure6: '',
        strMeasure7: '',
        strMeasure8: '',
        strMeasure9: '',
        strMeasure10: '',
        strMeasure11: '',
        strMeasure12: '',
        strMeasure13: '',
        strMeasure14: '',
        strMeasure15: '',
        strImageSource: '',
        strImageAttribution: '',
        strCreativeCommonsConfirmed: '',
        dateModified: '',
    });

    const [numIngredients, setNumIngredients] = useState('0');

    const handleChange =
        (prop: keyof Drink) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
        };
    
    const handleNumIngredientsChange = (event: SelectChangeEvent) => {
        setNumIngredients(event.target.value as string);
    };

    return (
        <div>
            <Grid className='form'>
                <h1> Recipes </h1>

                <InputLabel htmlFor='cocktail-name'> Cocktail Name: </InputLabel>
                <TextField
                    required
                    id='cocktail-name'
                    value={values.strDrink}
                    onChange={handleChange('strDrink')}
                ></TextField>

                <InputLabel htmlFor='cocktail-alcoholic'> Will this drink contain alcohol? </InputLabel>
                <RadioGroup
                    id='cocktail-alcoholic'
                    defaultValue={'Alcoholic'}
                    onChange={handleChange('strAlcoholic')}
                    row={true}
                >
                    <FormControlLabel value='Alcoholic' control={<Radio />} label="Yes" />
                    <FormControlLabel value='Non_Alcoholic' control={<Radio />} label="No" />
                </RadioGroup>

                <InputLabel htmlFor='cocktail-instructions'> Instructions: </InputLabel>
                <TextField
                    required
                    id='cocktail-instructions'
                    value={values.strInstructions}
                    onChange={handleChange('strInstructions')}
                ></TextField>

                <InputLabel htmlFor='cocktail-ingredients'> Ingredients and Measurements: </InputLabel>
                <Select
                    required
                    id='cocktail-ingredients'
                    value={numIngredients}
                    onChange={handleNumIngredientsChange}
                >
                    <MenuItem value={0}> --Select-- </MenuItem>
                    <MenuItem value={1}> 1 </MenuItem>
                    <MenuItem value={2}> 2 </MenuItem>
                    <MenuItem value={3}> 3 </MenuItem>
                    <MenuItem value={4}> 4 </MenuItem>
                    <MenuItem value={5}> 5 </MenuItem>
                    <MenuItem value={6}> 6 </MenuItem>
                    <MenuItem value={7}> 7 </MenuItem>
                    <MenuItem value={8}> 8 </MenuItem>
                    <MenuItem value={9}> 9 </MenuItem>
                    <MenuItem value={10}> 10 </MenuItem>
                    <MenuItem value={11}> 11 </MenuItem>
                    <MenuItem value={12}> 12 </MenuItem>
                    <MenuItem value={13}> 13 </MenuItem>
                    <MenuItem value={14}> 14 </MenuItem>
                    <MenuItem value={15}> 15 </MenuItem>
                </Select>

                <div className='cocktail-specifications'>
                    <div id='ingredients'>
                        {parseInt(numIngredients) >= 1 && <InputLabel htmlFor='ingredient1'> Ingredient 1 </InputLabel>}
                        {parseInt(numIngredients) >= 1 && <TextField id='ingredient1' onChange={handleChange('strIngredient1')}></TextField>}

                        {parseInt(numIngredients) >= 2 && <InputLabel htmlFor='ingredient2'> Ingredient 2 </InputLabel>}
                        {parseInt(numIngredients) >= 2 && <TextField id='ingredient2' onChange={handleChange('strIngredient2')}></TextField>}

                        {parseInt(numIngredients) >= 3 && <InputLabel htmlFor='ingredient3'> Ingredient 3 </InputLabel>}
                        {parseInt(numIngredients) >= 3 && <TextField id='ingredient3' onChange={handleChange('strIngredient3')}></TextField>}

                        {parseInt(numIngredients) >= 4 && <InputLabel htmlFor='ingredient4'> Ingredient 4 </InputLabel>}
                        {parseInt(numIngredients) >= 4 && <TextField id='ingredient4' onChange={handleChange('strIngredient4')}></TextField>}

                        {parseInt(numIngredients) >= 5 && <InputLabel htmlFor='ingredient5'> Ingredient 5 </InputLabel>}
                        {parseInt(numIngredients) >= 5 && <TextField id='ingredient5' onChange={handleChange('strIngredient5')}></TextField>}

                        {parseInt(numIngredients) >= 6 && <InputLabel htmlFor='ingredient6'> Ingredient 6 </InputLabel>}
                        {parseInt(numIngredients) >= 6 && <TextField id='ingredient6' onChange={handleChange('strIngredient6')}></TextField>}

                        {parseInt(numIngredients) >= 7 && <InputLabel htmlFor='ingredient7'> Ingredient 7 </InputLabel>}
                        {parseInt(numIngredients) >= 7 && <TextField id='ingredient7' onChange={handleChange('strIngredient7')}></TextField>}

                        {parseInt(numIngredients) >= 8 && <InputLabel htmlFor='ingredient8'> Ingredient 8 </InputLabel>}
                        {parseInt(numIngredients) >= 8 && <TextField id='ingredient8' onChange={handleChange('strIngredient8')}></TextField>}

                        {parseInt(numIngredients) >= 9 && <InputLabel htmlFor='ingredient9'> Ingredient 9 </InputLabel>}
                        {parseInt(numIngredients) >= 9 && <TextField id='ingredient9' onChange={handleChange('strIngredient9')}></TextField>}

                        {parseInt(numIngredients) >= 10 && <InputLabel htmlFor='ingredient10'> Ingredient 10 </InputLabel>}
                        {parseInt(numIngredients) >= 10 && <TextField id='ingredient10' onChange={handleChange('strIngredient10')}></TextField>}

                        {parseInt(numIngredients) >= 11 && <InputLabel htmlFor='ingredient11'> Ingredient 11 </InputLabel>}
                        {parseInt(numIngredients) >= 11 && <TextField id='ingredient11' onChange={handleChange('strIngredient11')}></TextField>}

                        {parseInt(numIngredients) >= 12 && <InputLabel htmlFor='ingredient12'> Ingredient 12 </InputLabel>}
                        {parseInt(numIngredients) >= 12 && <TextField id='ingredient12' onChange={handleChange('strIngredient12')}></TextField>}

                        {parseInt(numIngredients) >= 13 && <InputLabel htmlFor='ingredient13'> Ingredient 13 </InputLabel>}
                        {parseInt(numIngredients) >= 13 && <TextField id='ingredient13' onChange={handleChange('strIngredient13')}></TextField>}

                        {parseInt(numIngredients) >= 14 && <InputLabel htmlFor='ingredient14'> Ingredient 14 </InputLabel>}
                        {parseInt(numIngredients) >= 14 && <TextField id='ingredient14' onChange={handleChange('strIngredient14')}></TextField>}

                        {parseInt(numIngredients) >= 15 && <InputLabel htmlFor='ingredient15'> Ingredient 15 </InputLabel>}
                        {parseInt(numIngredients) >= 15 && <TextField id='ingredient15' onChange={handleChange('strIngredient15')}></TextField>}
                    </div>

                    <div id='measurements'>
                        {parseInt(numIngredients) >= 1 && <InputLabel htmlFor='measurement1'> Measurement 1 </InputLabel>}
                        {parseInt(numIngredients) >= 1 && <TextField id='measurement1' onChange={handleChange('strMeasure1')}></TextField>}

                        {parseInt(numIngredients) >= 2 && <InputLabel htmlFor='measurement2'> Measurement 2 </InputLabel>}
                        {parseInt(numIngredients) >= 2 && <TextField id='measurement2' onChange={handleChange('strMeasure2')}></TextField>}

                        {parseInt(numIngredients) >= 3 && <InputLabel htmlFor='measurement3'> Measurement 3 </InputLabel>}
                        {parseInt(numIngredients) >= 3 && <TextField id='measurement3' onChange={handleChange('strMeasure3')}></TextField>}

                        {parseInt(numIngredients) >= 4 && <InputLabel htmlFor='measurement4'> Measurement 4 </InputLabel>}
                        {parseInt(numIngredients) >= 4 && <TextField id='measurement4' onChange={handleChange('strMeasure4')}></TextField>}

                        {parseInt(numIngredients) >= 5 && <InputLabel htmlFor='measurement5'> Measurement 5 </InputLabel>}
                        {parseInt(numIngredients) >= 5 && <TextField id='measurement5' onChange={handleChange('strMeasure5')}></TextField>}

                        {parseInt(numIngredients) >= 6 && <InputLabel htmlFor='measurement6'> Measurement 6 </InputLabel>}
                        {parseInt(numIngredients) >= 6 && <TextField id='measurement6' onChange={handleChange('strMeasure6')}></TextField>}

                        {parseInt(numIngredients) >= 7 && <InputLabel htmlFor='measurement7'> Measurement 7 </InputLabel>}
                        {parseInt(numIngredients) >= 7 && <TextField id='measurement7' onChange={handleChange('strMeasure7')}></TextField>}

                        {parseInt(numIngredients) >= 8 && <InputLabel htmlFor='measurement8'> Measurement 8 </InputLabel>}
                        {parseInt(numIngredients) >= 8 && <TextField id='measurement8' onChange={handleChange('strMeasure8')}></TextField>}

                        {parseInt(numIngredients) >= 9 && <InputLabel htmlFor='measurement9'> Measurement 9 </InputLabel>}
                        {parseInt(numIngredients) >= 9 && <TextField id='measurement9' onChange={handleChange('strMeasure9')}></TextField>}

                        {parseInt(numIngredients) >= 10 && <InputLabel htmlFor='measurement10'> Measurement 10 </InputLabel>}
                        {parseInt(numIngredients) >= 10 && <TextField id='measurement10' onChange={handleChange('strMeasure10')}></TextField>}

                        {parseInt(numIngredients) >= 11 && <InputLabel htmlFor='measurement11'> Measurement 11 </InputLabel>}
                        {parseInt(numIngredients) >= 11 && <TextField id='measurement11' onChange={handleChange('strMeasure11')}></TextField>}

                        {parseInt(numIngredients) >= 12 && <InputLabel htmlFor='measurement12'> Measurement 12 </InputLabel>}
                        {parseInt(numIngredients) >= 12 && <TextField id='measurement12' onChange={handleChange('strMeasure12')}></TextField>}

                        {parseInt(numIngredients) >= 13 && <InputLabel htmlFor='measurement13'> Measurement 13 </InputLabel>}
                        {parseInt(numIngredients) >= 13 && <TextField id='measurement13' onChange={handleChange('strMeasure13')}></TextField>}

                        {parseInt(numIngredients) >= 14 && <InputLabel htmlFor='measurement14'> Measurement 14 </InputLabel>}
                        {parseInt(numIngredients) >= 14 && <TextField id='measurement14' onChange={handleChange('strMeasure14')}></TextField>}

                        {parseInt(numIngredients) >= 15 && <InputLabel htmlFor='measurement15'> Measurement 15 </InputLabel>}
                        {parseInt(numIngredients) >= 15 && <TextField id='measurement15' onChange={handleChange('strMeasure15')}></TextField>}
                    </div>
                </div>

                <div className='submit'>
                    <Button variant='outlined'> Create Recipe </Button>
                </div>
            </Grid>
        </div>
    );
}

export default RecipeForm;