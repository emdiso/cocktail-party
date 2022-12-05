import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Slider, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { get, post } from '../../axios.service';
import axios, { Axios, AxiosResponse } from 'axios';
import './../styling/App.css';
import { Label } from '@mui/icons-material';
import CustomRecipe from './../../models/CustomRecipe';
import './../styling/RecipeForm.css';
import { isDOMComponent } from 'react-dom/test-utils';
import FormData from 'form-data';
import { useLocation } from 'react-router-dom';
import { valueContainerCSS } from 'react-select/dist/declarations/src/components/containers';
import e from 'express';

const defaultValues: CustomRecipe = {
    id: undefined as unknown as number,
    image_id: undefined as unknown as number,
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
};

const RecipeForm = () => {
    const location = useLocation();

    const [values, setValues] = React.useState<CustomRecipe>(defaultValues);
    const [imgUploaded, setImageUploaded] = useState<File | undefined>(undefined);
    const [specifications, setSpecifications] = useState([{ ingredient: '', measurement: '' }]);
    const [existingImg, setExistingImg] = useState<File | string | undefined>(undefined);

    const handleFillRows = (pValues: any) => {
        let ingredientsMeasurements = [
            { ingredient: pValues.strIngredient1, measurement: pValues.strMeasure1 },
            { ingredient: pValues.strIngredient2, measurement: pValues.strMeasure2 },
            { ingredient: pValues.strIngredient3, measurement: pValues.strMeasure3 },
            { ingredient: pValues.strIngredient4, measurement: pValues.strMeasure4 },
            { ingredient: pValues.strIngredient5, measurement: pValues.strMeasure5 },
            { ingredient: pValues.strIngredient6, measurement: pValues.strMeasure6 },
            { ingredient: pValues.strIngredient7, measurement: pValues.strMeasure7 },
            { ingredient: pValues.strIngredient8, measurement: pValues.strMeasure8 },
            { ingredient: pValues.strIngredient9, measurement: pValues.strMeasure9 },
            { ingredient: pValues.strIngredient10, measurement: pValues.strMeasure10 },
            { ingredient: pValues.strIngredient11, measurement: pValues.strMeasure11 },
            { ingredient: pValues.strIngredient12, measurement: pValues.strMeasure12 },
            { ingredient: pValues.strIngredient13, measurement: pValues.strMeasure13 },
            { ingredient: pValues.strIngredient14, measurement: pValues.strMeasure14 },
            { ingredient: pValues.strIngredient15, measurement: pValues.strMeasure15 }
        ];

        let finIM = ingredientsMeasurements.filter((e) => { return e.ingredient !== null || '' || undefined });
        setSpecifications(finIM);
    }

    useEffect(() => {
        if (location.state) {
            if (values !== defaultValues) return;
            const id = location.state.id;
            const idDrink = location.state.idDrink;

            if (idDrink) {
                get(`/cocktail_api/drink_by_id?id=${idDrink}`, {},
                    (response) => {
                        setValues(response.data);
                        handleFillRows(response.data);
                        handleExistingImg(response.data.strDrinkThumb);
                    });
            }
            else {
                get(`/recipe/custom_recipe?id=${id}`, {},
                    (response) => {
                        setValues(response.data);
                        handleFillRows(response.data);
                        handleExistingImg(response.data.strDrinkThumb);
                    });
            }
        }
    }, [values]);

    const handleExistingImg = (imgPath: string) => {
        setExistingImg(imgPath);
    }

    const handleChange = (prop: keyof CustomRecipe) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleNewSpec = () => {
        setSpecifications([...specifications, { ingredient: '', measurement: '' }]);
    }

    const handleRemoveSpec = (index: number) => {
        const list = [...specifications];
        list.splice(index, 1);
        setSpecifications(list);
    }

    const handleIngredientChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target;
        const value = event.target.value;
        const list = [...specifications];
        list[index].ingredient = value;
        setSpecifications(list);
    }

    const handleMeasurementChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target;
        const value = event.target.value;
        const list = [...specifications];
        list[index].measurement = value;
        setSpecifications(list);
    }

    const handleImageUpload = (event: React.FormEvent<HTMLInputElement>) => {
        if (!event.currentTarget.files) {
            setImageUploaded(undefined);
        } else {
            setImageUploaded(event.currentTarget.files[0]);
        }
    }

    const removeImage = () => {
        setImageUploaded(undefined);
    }

    const handleSubmit = () => {
        // Ingredients and Measurements Data
        for (let i = 0; i < specifications.length; i++) {
            let customCocktailIngredient = 'strIngredient' + (i + 1);
            let customCocktailMeasurement = 'strMeasure' + (i + 1);

            if (customCocktailIngredient === 'strIngredient1' && customCocktailMeasurement === 'strMeasure1') {
                values.strIngredient1 = specifications[0].ingredient;
                values.strMeasure1 = specifications[0].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient2' && customCocktailMeasurement === 'strMeasure2') {
                values.strIngredient2 = specifications[1].ingredient;
                values.strMeasure2 = specifications[1].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient3' && customCocktailMeasurement === 'strMeasure3') {
                values.strIngredient3 = specifications[2].ingredient;
                values.strMeasure3 = specifications[2].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient4' && customCocktailMeasurement === 'strMeasure4') {
                values.strIngredient4 = specifications[3].ingredient;
                values.strMeasure4 = specifications[3].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient5' && customCocktailMeasurement === 'strMeasure5') {
                values.strIngredient5 = specifications[4].ingredient;
                values.strMeasure5 = specifications[4].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient6' && customCocktailMeasurement === 'strMeasure6') {
                values.strIngredient6 = specifications[5].ingredient;
                values.strMeasure6 = specifications[5].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient7' && customCocktailMeasurement === 'strMeasure7') {
                values.strIngredient7 = specifications[6].ingredient;
                values.strMeasure7 = specifications[6].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient8' && customCocktailMeasurement === 'strMeasure8') {
                values.strIngredient8 = specifications[7].ingredient;
                values.strMeasure8 = specifications[7].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient9' && customCocktailMeasurement === 'strMeasure9') {
                values.strIngredient9 = specifications[8].ingredient;
                values.strMeasure9 = specifications[8].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient10' && customCocktailMeasurement === 'strMeasure10') {
                values.strIngredient10 = specifications[9].ingredient;
                values.strMeasure10 = specifications[9].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient11' && customCocktailMeasurement === 'strMeasure11') {
                values.strIngredient11 = specifications[10].ingredient;
                values.strMeasure11 = specifications[10].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient12' && customCocktailMeasurement === 'strMeasure12') {
                values.strIngredient12 = specifications[11].ingredient;
                values.strMeasure12 = specifications[11].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient13' && customCocktailMeasurement === 'strMeasure13') {
                values.strIngredient13 = specifications[12].ingredient;
                values.strMeasure13 = specifications[12].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient14' && customCocktailMeasurement === 'strMeasure14') {
                values.strIngredient14 = specifications[13].ingredient;
                values.strMeasure14 = specifications[13].measurement;
            }
            else if (customCocktailIngredient === 'strIngredient15' && customCocktailMeasurement === 'strMeasure15') {
                values.strIngredient15 = specifications[14].ingredient;
                values.strMeasure15 = specifications[14].measurement;
            }
        }

        let formData = new FormData();

        if (imgUploaded) {
            formData.append('image', imgUploaded);
        }
        else {
            if (typeof existingImg === "string") {
                axios({
                    url: existingImg,
                    method: 'GET',
                    responseType: 'blob',
                })
                .then((res) => {
                    let data = res.data;
                    let metadata = {
                        type: 'image/*'
                    };
                    let temp = existingImg.split('/');
                    let tempSize = temp.length;

                    let fileName = temp[tempSize - 1];
                    const file = new File([data], fileName, metadata);

                    formData.append('image', file);
                });
            }
            else {
                formData.append('image', existingImg);
            }
        }

        values.id && formData.append('id', values.id);
        values.image_id && formData.append('image_id', values.image_id);
        values.strDrink && formData.append('strDrink', values.strDrink);
        values.strAlcoholic && formData.append('strAlcoholic', values.strAlcoholic);
        values.strCategory && formData.append('strCategory', values.strCategory);
        values.strGlass && formData.append('strGlass', values.strGlass);
        values.strInstructions && formData.append('strInstructions', values.strInstructions);
        formData.append('strIngredient1', values.strIngredient1);
        formData.append('strIngredient2', values.strIngredient2);
        formData.append('strIngredient3', values.strIngredient3);
        formData.append('strIngredient4', values.strIngredient4);
        formData.append('strIngredient5', values.strIngredient5);
        formData.append('strIngredient6', values.strIngredient6);
        formData.append('strIngredient7', values.strIngredient7);
        formData.append('strIngredient8', values.strIngredient8);
        formData.append('strIngredient9', values.strIngredient9);
        formData.append('strIngredient10', values.strIngredient10);
        formData.append('strIngredient11', values.strIngredient11);
        formData.append('strIngredient12', values.strIngredient12);
        formData.append('strIngredient13', values.strIngredient13);
        formData.append('strIngredient14', values.strIngredient14);
        formData.append('strIngredient15', values.strIngredient15);
        formData.append('strMeasure1', values.strMeasure1);
        formData.append('strMeasure2', values.strMeasure2);
        formData.append('strMeasure3', values.strMeasure3);
        formData.append('strMeasure4', values.strMeasure4);
        formData.append('strMeasure5', values.strMeasure5);
        formData.append('strMeasure6', values.strMeasure6);
        formData.append('strMeasure7', values.strMeasure7);
        formData.append('strMeasure8', values.strMeasure8);
        formData.append('strMeasure9', values.strMeasure9);
        formData.append('strMeasure10', values.strMeasure10);
        formData.append('strMeasure11', values.strMeasure11);
        formData.append('strMeasure12', values.strMeasure12);
        formData.append('strMeasure13', values.strMeasure13);
        formData.append('strMeasure14', values.strMeasure14);
        formData.append('strMeasure15', values.strMeasure15);
        values.dateModified && formData.append('dateModified', values.dateModified);

        post('/recipe//upsert_custom_recipe', formData, {
            headers: {
                'Content-Type': 'Multipart/form-data'
            }
        }, (result) => {
            window.location.reload();
            window.location.href = '/profile';
        }, (error) => {
            console.log(error);
        });
    }

    const handleGetImgSrc = () => {
        if (imgUploaded) {
            return URL.createObjectURL(imgUploaded);
        } else {
            if (typeof existingImg === 'string') {
                return existingImg;
            } else {
                return URL.createObjectURL(existingImg || undefined as unknown as File);
            }
        }
    };

    return (
        <div>
            <div className="card m-3">
                <div className="card-body border-bottom">
                    <Grid className='form' style={{ paddingLeft: "2vw" }}>
                        <h1> Recipes </h1>

                        <div className='imgContainer'>
                            {(imgUploaded || existingImg) && <img id='image' src={handleGetImgSrc()} />}

                            <div>
                                <Button variant="outlined" component="label">
                                    {(imgUploaded === undefined || existingImg === undefined) ? "Upload Image" : "Change Image"}
                                    <input id='imgInput' hidden accept="image/*" type="file" onChange={handleImageUpload} />
                                </Button>
                                {(imgUploaded !== undefined || existingImg !== undefined) && <Button variant="outlined" component="label" onClick={removeImage}> Remove Image </Button>}
                            </div>
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
                            value={values.strAlcoholic}
                            onChange={handleChange('strAlcoholic')}
                            row={true}
                        >
                            <FormControlLabel value='Alcoholic' control={<Radio />} label="Yes" />
                            <FormControlLabel value='Non_Alcoholic' control={<Radio />} label="No" />
                        </RadioGroup>

                        <InputLabel htmlFor='cocktail-instructions'> Instructions: </InputLabel>
                        <TextField
                            required
                            multiline
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
                            <Button variant='outlined' onClick={handleSubmit}> Create Recipe </Button>
                        </div>
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default RecipeForm;
