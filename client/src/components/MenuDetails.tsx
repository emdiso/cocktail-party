import React from 'react';
import './App.css';
import { Drink } from './Random';

export interface menu {
  title: string,
  drinks: Drink[] // string of drink ids
}

function MenuDetails(data: any) {
  return (
    <div>
      <h5>Menu Details</h5>
      {data.data.map((item: any, index: number) =>
        <li key={index} className={item.strAlcoholic}>
          {item.strDrink} {item.strGlass}
        </li>
      )}
    </div>
  );
}

export default MenuDetails;