import { List, ListItem, ListItemText, Typography, Divider, Button } from '@mui/material';
import React from 'react';
import { PrettyDrink } from './forms/MenuFormatForm';
import html2canvas from 'html2canvas';
import { Recipe } from '../models';
import FormData from 'form-data';
import { post } from '../axios.service';
import { useNavigate } from 'react-router-dom';

function MenuPrettyDetails(data: any) {
    const printRef = React.useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element!, { useCORS: true });

        const url = canvas.toDataURL('image/jpg');
        canvas.toBlob((blob) => {
            const formData = new FormData();
            formData.append('image', blob);
            formData.append('menu_id', data.data.menuId)
            post('/menu_gen/insert_menu_image', formData, {}, () => {
                navigate('/menu', { state: { id: data.data.menuId } });
            });
        });
        // const link = document.createElement('a');

        // if (typeof link.download === 'string') {
        //     link.href = url;
        //     link.download = `${data.data.title}.jpg`;

        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        // } else {
        //     window.open(url);
        // }
    };

    const drinks = data.data.drinks;

    function getIngredients(data: any) {
        let ingredients: string[] = [];
        for (let i = 1; i < 16; i++) {
            if (data[`strIngredient${i}`]) {
                let ingredient = data[`strIngredient${i}`];
                ingredients.push(`${ingredient}, `)
            }
        }
        const ingredientsLength = ingredients.length;
        // lol this line gets rid of the comma at the end
        if (ingredientsLength > 0)
            ingredients[ingredientsLength - 1] = ingredients[ingredientsLength - 1].substring(0, ingredients[ingredientsLength - 1].length - 2);
        return ingredients;
    }

    return (
        <div>
            <div ref={printRef} style={{ backgroundColor: data.data.backgroundColor, height: "auto" }}>
                <h3 style={{ color: data.data.textColor, fontFamily: data.data.textFont, paddingTop: "2vw" }}>{data.data.title}</h3>

                <List sx={{ width: '100%', bgcolor: data.data.backgroundColor, paddingBottom: "2vw" }} >
                    {drinks.length > 0 ?
                        drinks.map((item: PrettyDrink, index: number) =>
                            <div key={index} style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}>
                                <ListItem>
                                    {/* <ListItemAvatar>
                                        <Avatar alt="" src={(item.drink as Recipe).strDrinkThumb || `${baseServerUrl}/image/display?imageId=${data.data.image_id}`} />
                                    </ListItemAvatar> */}
                                    <img style={{ width: "15%", borderRadius: "5px", marginLeft: "2vw" }} alt="" src={(item.drink as Recipe).strDrinkThumb} />
                                    <ListItemText
                                        style={item.drink.strAlcoholic.includes("Alcoholic") ? { color: data.data.alcoholicTextColor, textAlign: "left", marginLeft: "1vw", marginRight: "2vw" } : { color: data.data.textColor, textAlign: "left", marginLeft: "1vw", marginRight: "2vw" }}
                                        primaryTypographyProps={{ fontFamily: data.data.textFont }}
                                        primary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    fontFamily={data.data.textFont}
                                                    component="span"
                                                    variant="body2"
                                                    color={item.drink.strAlcoholic.includes("Alcoholic") ? data.data.alcoholicTextColor : data.data.textColor}
                                                >
                                                    {item.id} - {getIngredients(item.drink)}
                                                    <br></br>
                                                    {data.data.alcoholicLabel && item.drink.strAlcoholic.includes("Alcoholic") ? <i>(contains alcohol)</i> : <></>}
                                                </Typography>
                                            </React.Fragment>
                                        } />
                                </ListItem>
                            </div>
                        ) :
                        <ListItem>
                            <ListItemText primary="No items in menu." />
                        </ListItem>
                    }
                </List>
                {!data.data.alcoholicLabel ?
                    <div>
                        <Divider></Divider>
                        <p style={{ color: data.data.alcoholicTextColor, fontFamily: data.data.textFont }}><i>(contains alcohol)</i></p>
                    </div>
                    :
                    <span style={{ width: "0px", height: "0px" }}></span>
                }

            </div>
            <div>
                <Button onClick={handleSubmit} variant="contained" color="secondary" sx={{ mt: 1, mr: 1 }}>Save Design</Button>
            </div>
        </div>
    )
}

export default MenuPrettyDetails;