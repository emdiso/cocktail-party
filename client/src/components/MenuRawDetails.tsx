import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { Recipe, CustomRecipe } from '../models';
import './styling/App.css';

export interface MenuRawDetailsModel {
  title: string;
  menuRecipes: Recipe[] | CustomRecipe[];
}

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

function MenuRawDetails(data: any) {
  let recipes = data.data.menuRecipes;
  let title = data.data.title;

  return (
    <div>
      <h5>Menu Details</h5>
      <div className="card m-3">
        <div className="card-body border-bottom">
          <h5>{title}</h5>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {recipes.length > 0 ?
              recipes.map((item: any, index: number) =>
                <div key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="" src={item.strDrinkThumb} />
                    </ListItemAvatar>
                    <ListItemText className={item.strAlcoholic}
                      primary={item.strDrink}
                      secondary={<React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Category: {item.strCategory} <br></br>
                          {getIngredients(item)}
                        </Typography>
                      </React.Fragment>} />
                  </ListItem><Divider variant="inset" component="li" />
                </div>
              ) :
              <ListItem>
                <ListItemText primary="No items in menu." />
              </ListItem>
            }
          </List>
        </div>
      </div>
      <h6 className="Alcoholic">red means contains alcohol</h6>
    </div>
  );
}

export default MenuRawDetails;