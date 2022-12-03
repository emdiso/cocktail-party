import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@mui/material';
import { color } from '@mui/system';
import React from 'react';
import { CustomRecipe, Recipe } from '../models';
import recipe from '../models/Recipe';
import { MenuPrettyModel, PrettyDrink } from './forms/MenuFormatForm';

function MenuPrettyDetails(data: any) {
    const drinks = data.data.drinks;

    console.log(drinks[0]);

    function getIngredients(data: any) {
        let ingredients: string[] = [];
        for (let i = 1; i < 16; i++) {
            if (data[`strIngredient${i}`]) {
                ingredients.push(data[`strIngredient${i}`])
            }
        }
        return ingredients;
    }

    return (
        <div style={{backgroundColor: data.data.backgroundColor}}>
            <h5 style={{color: data.data.textColor}}>{data.data.title}</h5>

            <List sx={{ width: '100%', bgcolor: data.data.backgroundColor }}>
                {drinks.length > 0 ?
                    drinks.map((item: PrettyDrink, index: number) =>
                        <div key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Drink image not available" src={item.drink.strDrinkThumb} />
                                </ListItemAvatar>
                                <ListItemText style={{ color: data.data.textColor, fontFamily: data.data.textFont }}
                                    primary={item.drink.strDrink}
                                    secondary={<React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {getIngredients(item.drink)}
                                        </Typography>
                                    </React.Fragment>} />
                            </ListItem>
                        </div>
                    ) :
                    <ListItem>
                        <ListItemText primary="No items in menu." />
                    </ListItem>
                }
            </List>
        </div>
    )
}

export default MenuPrettyDetails;