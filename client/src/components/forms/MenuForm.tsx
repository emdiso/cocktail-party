import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button, Grid, Slider } from '@mui/material';
import MenuRawDetails from '../MenuRawDetails';
import { get, post } from '../../axios.service';
import { Axios, AxiosResponse } from 'axios';
import { TypeObject } from '@mui/material/styles/createPalette';
import { Link } from 'react-router-dom';

export interface Quantity {
  id: number,
  item: string,
  amount: number
}

export interface MenuModel {
  menuDrinks: any[],
  size: number,
  alcoholicQuantity: number,
  glassMap: Quantity[],
  categoryMap: Quantity[],
}

function usePreviousMenuModel(value: MenuModel) {
  const ref = useRef<MenuModel>();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

function MenuForm() {

  const [menuModel, setMenuModel] = useState<MenuModel>({
    menuDrinks: [], size: 0, alcoholicQuantity: 0, glassMap: [], categoryMap: []
  });

  const previousMenu = usePreviousMenuModel(menuModel); // allows us to track what actually changed in the object

  const [glassOptions, setGlassOptions] = useState<any[]>([]);

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

          obj.glassMap = [{
            id: 0,
            item: "None",
            amount: size
          }];

          return obj;
        });
      })

    get(
      "/cocktail_api/glass_options", {},
      (res: any) => {
        setGlassOptions(res.data.drinks);
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

  const changeGlassMapItemQuantity = (element: Quantity, e: any) => {
    let newNum = Number(e.target.value);
    if (newNum === element.amount) return;

    if (newNum < menuModel.size) {
      // want to push new field with the remaining difference as the amount
      setMenuModel((prev: MenuModel) => {
        let obj = { ...prev };

        let elem = obj.glassMap.find(function (item) {
          return item.id === element.id;
        });
        elem!.amount = newNum;

        let total = 0;
        obj.glassMap.forEach((item: Quantity) => {
          total += item.amount;
        })

        if (total < obj.size) {
          obj.glassMap.push({
            id: obj.glassMap.length,
            item: "None",
            amount: obj.size - total
          });
        }

        // TO DO -- when total > obj.size and ====

        return obj;
      });
    }
  }

  const changeGlassMapItem = (element: Quantity, e: any) => {
    let glass = e.target.value;

    setMenuModel((prev: MenuModel) => {
      let obj = { ...prev };

      let elem = obj.glassMap.find(function (item) {
        return item.id === element.id;
      });
      elem!.item = glass;

      return obj;
    });
  }

  React.useEffect(() => {

    if (previousMenu && previousMenu.alcoholicQuantity !== menuModel.alcoholicQuantity) {
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
    }

    // NEEDS CONDITIONAL FOR THE ABOVE TO WORK
    // post(
    //   '/cocktail_api/modify_menu_by_glass', menuModel, {},
    //   (res: AxiosResponse) => {
    //     setMenuModel(
    //       (prev: MenuModel) => {
    //         let obj = { ...prev };
    //         obj.menuDrinks = res.data.menuDrinks;
    //         return obj;
    //       }
    //     );
    //   }
    // )

  }, [menuModel]);

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

                  {menuModel.glassMap.map((element: Quantity, index: number) =>
                    <div key={index} className="form-row">
                      <div className="form-group">
                        <label>I want</label>
                        <select onChange={(e: any) => changeGlassMapItemQuantity(element, e)} defaultValue={element.amount}>
                          {Array(menuModel.size + 1).fill(0).map((item: any, i: number) =>
                            <option key={i} value={i}>{i}</option>
                          )}
                        </select>
                        <label>drinks to be served in a</label>
                        <select onChange={(e: any) => changeGlassMapItem(element, e)} defaultValue={element.item}>
                          <option key={-1} value={"None"}>{"Select a glass"}</option>
                          {glassOptions.map((item: any, i: number) =>
                            <option key={i} value={item.strGlass}>{item.strGlass}</option>
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
          <MenuRawDetails data={menuModel.menuDrinks} />
        </Grid>
      </Grid>

      <button>Reset</button>
      <button>Save</button>
    </div>
  );
}

export default MenuForm;
