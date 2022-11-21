import React from 'react';
import { getIngredients } from './RecipeCard';
import './styling/App.css';

function MenuRawDetails(data: any) {

  return (
    <div>
      <h5>Menu Details</h5>
      {data.data.map((item: any, index: number) =>
        <div>
          <h4 key={index} className={item.strAlcoholic}>
            {index}.{item.strDrink}
          </h4>
          <p>Category: {item.strCategory}</p>
          <p>Contains Alcohol: {item.strAlcoholic}</p>
        </div>
      )}
    </div>
  );
}

export default MenuRawDetails;