import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, Grid, Slider } from '@mui/material';
import MenuDetails from './MenuDetails';
import { get, post } from '../axios.service';
import { Axios, AxiosResponse } from 'axios';

export interface Quantity {
  item: string,
  amount: number
}

export interface MenuModel {
  menuDrinks: any[],
  size: number,
  alcoholicQuantity: number,
  liquorMap: Quantity[],
  categoryMap: Quantity[],
  vetoList: string[]
}

function MenuForm() {

  const [menuModel, setMenuModel] = useState<MenuModel>({
    menuDrinks: [], size: 0, alcoholicQuantity: 0, liquorMap: [], categoryMap: [], vetoList: []
  });

  const menuSizeSelected = (e: any) => {
    let size = e.target.value;
    get(
      "/cocktail_api/menu_by_size", { "size": size },
      (res: AxiosResponse) => {
        setMenuModel((prev: MenuModel) => {
          let obj = { ...prev };
          obj.size = size;
          obj.menuDrinks = res.data;

          let alcCount = 0;
          res.data.forEach((drink: any) => {
            if (drink.strAlcoholic.includes("Alcoholic")) {
              alcCount++;
            }
          });

          obj.alcoholicQuantity = alcCount;
          obj.liquorMap.push({
            item: "vodka",
            amount: size
          });
          return obj;
        });
      })
  }

  const setMenuModelAlcoholicQuantity = (e: any) => {
    setMenuModel(
      (prev: MenuModel) => {
        let obj = { ...prev };
        obj.alcoholicQuantity = e.target.value;
        return obj;
      }
    );
  }

  React.useEffect(() => {
    console.log("alcoholic quant changed", menuModel.alcoholicQuantity);
    post(
      '/cocktail_api/modify_menu_by_alcoholic', menuModel, {},
      (res: AxiosResponse) => {
        setMenuModel(
          (prev: MenuModel) => {
            let obj = { ...prev };
            obj.menuDrinks = res.data.menuDrinks;
            return obj;
          }
        );
      }
    )
  }, [menuModel.alcoholicQuantity]);

  const liquorFields = () => {
    menuModel.liquorMap.forEach((quantity: Quantity, index: number) => {
      console.log(quantity.item, quantity.amount);
    });
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="stretch">
        <Grid className="split-screen" item xs={5.8} >

          <div>
            <h5>Menu Form</h5>
            <form >
              <div className="card m-3">
                <div className="card-body border-bottom">

                  <div className="form-row">
                    <div className="form-group">
                      <label>Menu Size</label>
                      <select onChange={menuSizeSelected}>
                        {[0, 1, 5, 10, 15, 25, 30].map(i =>
                          <option key={i} value={i}>{i}</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Alcoholic Drink Quantity</label>
                      <select onChange={setMenuModelAlcoholicQuantity} value={menuModel.alcoholicQuantity}>
                        {menuModel.menuDrinks.map((item: any, i: number) =>
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        )}
                      </select>
                      <h5>{menuModel.alcoholicQuantity} drinks contain alcohol, {menuModel.menuDrinks.length - menuModel.alcoholicQuantity} are kid friendly.</h5>
                    </div>
                  </div>

                </div>
              </div>
            </form>
          </div>

        </Grid>

        <Grid className="split-screen" item xs={5.8}>
          <MenuDetails data={menuModel.menuDrinks} />
        </Grid>
      </Grid>

      <button>Reset</button>
      <button>Download</button>
      <button>Format</button>
    </div>
  );
}

export default MenuForm;
