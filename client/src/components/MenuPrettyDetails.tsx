import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, Button, Tooltip } from '@mui/material';
import React from 'react';
import { PrettyDrink } from './forms/MenuFormatForm';
import html2canvas from 'html2canvas';
import { Recipe } from '../models';

function MenuPrettyDetails(data: any) {
    const printRef = React.useRef(null);

    const handleSubmit = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element!, { useCORS: true });

        const url = canvas.toDataURL('image/jpg');
        const link = document.createElement('a');

        if (typeof link.download === 'string') {
            link.href = url;
            link.download = `${data.data.title}.jpg`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(url);
        }
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
        // lol this line gets rid of the comma at the end
        ingredients[ingredients.length - 1] = ingredients[ingredients.length - 1].substring(0, ingredients[ingredients.length - 1].length - 2);
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
                                    <img style={{ width: "10%", borderRadius: "5px", marginLeft: "2vw" }} alt="" src={(item.drink as Recipe).strDrinkThumb} />
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
                <Button onClick={handleSubmit} variant="contained" sx={{ mt: 1, mr: 1 }}>Generate QR Code</Button>
            </div>
        </div>
    )
}

export default MenuPrettyDetails;