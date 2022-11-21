import React, { useEffect, useRef, useState } from 'react';
import './../styling/MenuForms.css';
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
  categoryMap: Quantity[],
}

export interface Category {
  id: number,
  category: string,
  alcoholic: string
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
    menuDrinks: [], size: 0, alcoholicQuantity: 0, categoryMap: []
  });

  const previousMenu = usePreviousMenuModel(menuModel); // allows us to track what actually changed in the object

  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categoryOptionsChanged, setCategoryOptionsChanged] = useState<Boolean>(false);

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

          obj.categoryMap = [{
            id: 0,
            item: "None",
            amount: size
          }];

          return obj;
        });
      })

    get(
      "/cocktail_api/category_options", {},
      (res: any) => {
        setCategoryOptions(res.data.drinks);
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

  const changeCategoryMapQuantityAmount = (element: Quantity, e: any) => {
    let newNum = Number(e.target.value);
    if (newNum === element.amount) return;

    if (newNum < menuModel.size) {
      // want to push new field with the remaining difference as the amount
      setMenuModel((prev: MenuModel) => {
        let obj = { ...prev };

        let elem = obj.categoryMap.find(function (item) {
          return item.id === element.id;
        });
        elem!.amount = newNum;

        let total = 0;
        obj.categoryMap.forEach((item: Quantity) => {
          total += item.amount;
        })

        if (total < obj.size) {
          obj.categoryMap.push({
            id: obj.categoryMap.length,
            item: "None",
            amount: obj.size - total
          });
        }

        // TO DO -- when total > obj.size and ====

        return obj;
      });

      setCategoryOptionsChanged(true);
    }
  }

  const changeCategoryMapQuantityItem = (element: Quantity, e: any) => {
    let glass = e.target.value;

    setMenuModel((prev: MenuModel) => {
      let obj = { ...prev };

      let elem = obj.categoryMap.find(function (item) {
        return item.id === element.id;
      });
      elem!.item = glass;

      return obj;
    });

    setCategoryOptionsChanged(true);
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
    if (previousMenu && categoryOptionsChanged) {
      post(
        '/cocktail_api/modify_menu_by_category', menuModel, {},
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
    }

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

                  {menuModel.categoryMap.map((element: Quantity, index: number) =>
                    <div key={index} className="form-row">
                      <div className="form-group">
                        <label>I want</label>
                        <select onChange={(e: any) => changeCategoryMapQuantityAmount(element, e)} defaultValue={element.amount}>
                          {Array(menuModel.size + 1).fill(0).map((item: any, i: number) =>
                            <option key={i} value={i}>{i}</option>
                          )}
                        </select>
                        <label>drinks to be of category</label>
                        <select onChange={(e: any) => changeCategoryMapQuantityItem(element, e)} defaultValue={element.item}>
                          <option key={-1} value={"None"}>{"Select a category"}</option>
                          {categoryOptions.map((item: any, i: number) =>
                            <option key={i} value={item.strCategory}>{item.strCategory}</option>
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
      <button>Save and Format</button>
    </div>
  );
}

export default MenuForm;
