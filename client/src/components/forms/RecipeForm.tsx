import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Slider, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { get, post } from '../../axios.service';
import { Axios, AxiosResponse } from 'axios';
import './../styling/App.css';
import { Label } from '@mui/icons-material';
import CustomRecipe from './../../models/CustomRecipe';
import './../styling/RecipeForm.css';

const RecipeForm = () => {
    const [values, setValues] = React.useState<CustomRecipe>({
        id: 0,
        image_id: 0,
        strDrink: '',
        strAlcoholic: '',
        strCategory: '',
        strGlass: '',
        strInstructions: '',
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
        dateModified: '',
    });

    const [imgUploaded, setImageUploaded] = useState('');
    const [specifications, setSpecifications] = useState([{ingredient: '', measurement: ''}]);

    const handleChange =
        (prop: keyof CustomRecipe) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
        };

    const handleNewSpec = () => {
        setSpecifications([...specifications, {ingredient: '', measurement: ''}]);
    }

    const handleRemoveSpec = (index: number) => {
        const list = [...specifications];
        list.splice(index, 1);
        setSpecifications(list);
    }

    const handleIngredientChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target;
        const value = event.target.value;
        const list = [... specifications];
        list[index].ingredient = value;
        setSpecifications(list);
    }

    const handleMeasurementChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target;
        const value = event.target.value;
        const list = [... specifications];
        list[index].measurement = value;
        setSpecifications(list);
    }

    const handleImageUpload = (event: React.FormEvent<HTMLInputElement>) => {
        if (!event.currentTarget.files) {
            setImageUploaded('');
        } else {
            setImageUploaded(URL.createObjectURL(event.currentTarget.files[0]));
        }
    }

    const removeImage = () => {
        setImageUploaded('');
    }

    return (
        <div>
            <Grid className='form'>
                <h1> Recipes </h1>

                <div className='imgContainer'>
                    {imgUploaded!='' && <img id='image' src={imgUploaded}></img>}

                        {imgUploaded=='' ? <div> <Button variant="outlined" component="label">
                            Upload Image
                            <input id='image' hidden accept="image/*" multiple type="file" onChange={handleImageUpload}/>
                        </Button> </div>
                        : 
                        <div className='imgButtonsAfter'> <Button variant="outlined" component="label">
                            Change Image
                            <input id='image' hidden accept="image/*" multiple type="file" onChange={handleImageUpload}/>
                        </Button> <Button variant="outlined" component="label" onClick={removeImage}> Remove Image </Button> </div>}
                </div>

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

                <div className='cocktail-specifications'>
                    {specifications.map((singleSpec, index) => (
                        <div key={index} className='row1'>
                            <div id='ingredients'>
                                <InputLabel htmlFor='ingredient'> Ingredient </InputLabel>
                                <TextField 
                                    required
                                    name='ingredient'
                                    id='ingredient'
                                    value={singleSpec.ingredient}
                                    onChange={handleIngredientChange(index)}
                                ></TextField>
                            </div>
                            <div id='measurements'>
                                <InputLabel htmlFor='measurement'> Measurement </InputLabel>
                                <TextField
                                    required
                                    name='measurement'
                                    id='measurement'
                                    value={singleSpec.measurement}
                                    onChange={handleMeasurementChange(index)}
                                ></TextField>
                            </div>
                            {specifications.length >= 2 && <div id='delete'>
                                <IconButton aria-label="delete" color="primary" onClick={() => handleRemoveSpec(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>}
                        </div>
                    ))}
                    {specifications.length <= 15 && <div className='row2'>
                        <Button onClick={handleNewSpec}> Add Ingredient </Button>
                    </div>}
                </div>

                <div className='submit'>
                    <Button variant='outlined'> Create Recipe </Button>
                </div>
            </Grid>
        </div>
    );
}

export default RecipeForm;