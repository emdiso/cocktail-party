import React from 'react';
import './App.css';

function MenuRawDetails(data: any) {
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

export default MenuRawDetails;