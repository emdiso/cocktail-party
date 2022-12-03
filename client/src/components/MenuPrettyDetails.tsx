import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@mui/material';
import React from 'react';
import { MenuPrettyModel, PrettyDrink } from './forms/MenuFormatForm';


function MenuPrettyDetails(data: any) {
    const drinks = data.data.drinks;
    
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
        <div style={{ backgroundColor: data.data.backgroundColor }}>
            <h5 style={{ color: data.data.textColor, fontFamily: data.data.textFont }}>{data.data.title}</h5>

            <List sx={{ width: '100%', bgcolor: data.data.backgroundColor }}>
                {drinks.length > 0 ?
                    drinks.map((item: PrettyDrink, index: number) =>
                        <div key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Drink image not available" src={item.drink.strDrinkThumb} />
                                </ListItemAvatar>
                                <ListItemText style={{ color: data.data.textColor }}
                                    primaryTypographyProps={{ fontFamily: data.data.textFont }}
                                    primary={item.id}
                                    secondary={<React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            fontFamily={data.data.textFont}
                                            component="span"
                                            variant="body2"
                                            color={data.data.textColor}
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