import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, Grid, Slider } from '@mui/material';
import MenuDetails from './MenuDetails';
import { get, post } from '../axios.service';
import { Axios, AxiosResponse } from 'axios';

export interface Quantity {
  id: number,
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

  const [ingredientOptions, setIngredientOptions] = useState<any[]>([]);

  const menuSizeSelected = (e: any) => {
    let size = Number(e.target.value);
    get(
      "/cocktail_api/menu_by_size", { "size": size },
      (res: AxiosResponse) => {
        setMenuModel((prev: MenuModel) => {
          let obj = { ...prev };
          obj.size = size;
          obj.menuDrinks = res.data;

          let alcoholic = res.data.filter(function (item: any) {
            return item.strAlcoholic.includes("Alcoholic");
          })
          obj.alcoholicQuantity = alcoholic.length;

          obj.liquorMap = [{
            id: 0,
            item: "None",
            amount: size
          }];

          return obj;
        });
      })

    get(
      "/cocktail_api/ingredient_options", {},
      (res: any) => {
        setIngredientOptions(res.data.drinks);
      }
    )
  }

  const setMenuModelAlcoholicQuantity = (e: any) => {
    setMenuModel(
      (prev: MenuModel) => {
        let obj = { ...prev };
        obj.alcoholicQuantity = Number(e.target.value);
        return obj;
      }
    );
  }

  React.useEffect(() => {
    console.log("alcoholic quant changed", menuModel.alcoholicQuantity);
    post(
      '/cocktail_api/modify_menu_by_alcoholic', menuModel, {},
      (res: AxiosResponse) => {
        console.log(res.data);
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

  const changeLiquorMapItemQuantity = (element: Quantity, e: any) => {
    let newNum = Number(e.target.value);
    if(newNum === element.amount) return;

    if (newNum < menuModel.size) {
      // want to push new field with the remaining difference as the amount
      setMenuModel((prev: MenuModel) => {
        let obj = { ...prev };

        let elem = obj.liquorMap.find(function (item) {
          return item.id === element.id;
        });
        elem!.amount = newNum;

        let total = 0;
        obj.liquorMap.forEach((item:Quantity) => {
          total += item.amount;
        })

        if (total < obj.size ) {
          obj.liquorMap.push({
            id: obj.liquorMap.length,
            item: "None",
            amount: obj.size - total
          });
        }

        // TO DO -- when total > obj.size and ====
        
        return obj;
      });
    }
  }

  React.useEffect(() => {
    post(
      '/cocktail_api/modify_menu_by_ingredient', menuModel, {},
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
  }, [menuModel.liquorMap]);

  React.useEffect(() => {
    console.log("menu model has changed", menuModel);
  }, [menuModel]);

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

                  {menuModel.liquorMap.map((element: Quantity, index: number) =>
                    <div key={index} className="form-row">
                      <div className="form-group">
                        <label>I want</label>
                        <select onChange={(e: any) => changeLiquorMapItemQuantity(element, e)} defaultValue={element.amount}>
                          {Array(menuModel.size + 1).fill(0).map((item: any, i: number) =>
                            <option key={i} value={i}>{i}</option>
                          )}
                        </select>
                        <label>drinks to contain</label>
                        <select defaultValue={element.item}>
                          <option key={-1} value={"None"}>{"Select an Ingredient"}</option>
                          {ingredientOptions.map((item: any, i: number) =>
                            <option key={i} value={item.strIngredient1}>{item.strIngredient1}</option>
                          )}
                        </select>
                      </div>
                    </div>
                  )}

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
      <button>Save</button>
      <button>Format</button>
    </div>
  );
}

export default MenuForm;
