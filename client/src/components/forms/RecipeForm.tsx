import React, { useEffect, useState } from 'react';
import { Button, FormControlLabel, Grid, IconButton, InputLabel, Radio, RadioGroup, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { baseServerUrl, get, post } from '../../axios.service';
import axios from 'axios';
import './../styling/App.css';
import CustomRecipe from './../../models/CustomRecipe';
import './../styling/RecipeForm.css';
import FormData from 'form-data';
import { useLocation } from 'react-router-dom';

const defaultValues: CustomRecipe = {
    id: undefined as unknown as number,
    image_id: undefined as unknown as number,
    strDrink: '',
    strAlcoholic: '',
    strCategory: null,
    strGlass: null,
    strInstructions: null,
    strIngredient1: null,
    strIngredient2: null,
    strIngredient3: null,
    strIngredient4: null,
    strIngredient5: null,
    strIngredient6: null,
    strIngredient7: null,
    strIngredient8: null,
    strIngredient9: null,
    strIngredient10: null,
    strIngredient11: null,
    strIngredient12: null,
    strIngredient13: null,
    strIngredient14: null,
    strIngredient15: null,
    strMeasure1: null,
    strMeasure2: null,
    strMeasure3: null,
    strMeasure4: null,
    strMeasure5: null,
    strMeasure6: null,
    strMeasure7: null,
    strMeasure8: null,
    strMeasure9: null,
    strMeasure10: null,
    strMeasure11: null,
    strMeasure12: null,
    strMeasure13: null,
    strMeasure14: null,
    strMeasure15: null,
    dateModified: null,
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
                        setExistingImg(response.data.strDrinkThumb);
                    });
            }
            else {
                get(`/recipe/custom_recipe?id=${id}`, {},
                    (response) => {
                        setValues(response.data);
                        handleFillRows(response.data);
                        if (response.data.image_id)
                            setExistingImg(`${baseServerUrl}/image/display?imageId=${response.data.image_id}`);
                    });
            }
        }
    }, [values]);

    const handleChange = (prop: keyof CustomRecipe) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleNewSpec = () => {
        setSpecifications([...specifications, { ingredient: '', measurement: '' }]);
    }

    const handleRemoveSpec = (index: number) => {
        const list = [...specifications];
        console.log(list);
        list.splice(index, 1);
        console.log(list);
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

    const handleSubmit = async () => {
        // Ingredients and Measurements Data
        for (let i = 0; i < 15; i++) {
            const specificationsLength = specifications.length;
            if (specificationsLength > i) {
                (values as any)[`strIngredient${i+1}`] = specifications[i].ingredient;
                (values as any)[`strMeasure${i+1}`] = specifications[i].measurement;
            } else {
                (values as any)[`strIngredient${i+1}`] = null;
                (values as any)[`strMeasure${i+1}`] = null;
            }
        }

        let formData = new FormData();

        if (imgUploaded) {
            formData.append('image', imgUploaded);
        }
        else {
            if (typeof existingImg === "string") {
                if (!values.id) {
                    const imageResponse = await axios({
                        url: existingImg,
                        method: 'GET',
                        responseType: 'blob',
                    });
                    let data = imageResponse.data;
                    let metadata = {
                        type: 'image/*'
                    };
                    let temp = existingImg.split('/');
                    let tempSize = temp.length;
    
                    let fileName = temp[tempSize - 1];
                    const file = new File([data], fileName, metadata);
    
                    formData.append('image', file);
                }
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
        for (let i = 1; i < 16; i++) {
            const ingredientName = `strIngredient${i}`;
            (values as any)[ingredientName] && formData.append(ingredientName, (values as any)[ingredientName]);
            const measureName = `strMeasure${i}`;
            (values as any)[measureName] && formData.append(measureName, (values as any)[measureName]);
        }
        values.dateModified && formData.append('dateModified', values.dateModified);

        post('/recipe//upsert_custom_recipe', formData, {
            headers: {
                'Content-Type': 'Multipart/form-data'
            }
        }, (result) => {
            window.location.reload(); // TODO: shouldn't this be deleted?
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
                            <Button variant='outlined' onClick={handleSubmit}>{values.id ? "Modify Custom Recipe" : "Create Custom Recipe"}</Button>
                        </div>
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default RecipeForm;
