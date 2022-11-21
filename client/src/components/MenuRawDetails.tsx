import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React from 'react';
import './styling/App.css';

function getIngredients(data: any) {
  let ingredients: string[] = [];
  for (let i = 1; i < 16; i++) {
    if (data[`strIngredient${i}`]) {
      ingredients.push(data[`strIngredient${i}`])
      ingredients.push(",");
    }
  }
  return ingredients.slice(0,ingredients.length-2).toString();
}

function MenuRawDetails(data: any) {

  return (
    <div>
      <h5>Menu Details</h5>

      <pre ></pre>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {data.data.map((item: any, index: number) =>
          <div key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Drink image not available" src={item.strDrinkThumb} />
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
        )}
      </List>

      <h6 className="Alcoholic">contains alcohol</h6>
    </div>
  );
}

export default MenuRawDetails;