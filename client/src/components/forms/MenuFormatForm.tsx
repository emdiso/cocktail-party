import React, { useEffect, useRef, useState } from 'react';
import { Grid } from '@mui/material';
import MenuPrettyDetails from '../MenuPrettyDetails';
import { Recipe, CustomRecipe } from '../../models';
import { get } from '../../axios.service';
import { useLocation } from 'react-router-dom';
import { bool } from 'yup';

export interface PrettyDrink {
    number: number,
    drink: Recipe | CustomRecipe,
}

export interface MenuPrettyModel {
    title: string,
    backgroundColor: string,
    textColor: string,
    textFont: string,
    drinks: PrettyDrink[], // string of drink ids
    alcoholicLabel: Boolean,
    alcoholicTextColor: string
}

function usePreviousMenuPrettyModel(value: MenuPrettyModel) {
    const ref = useRef<MenuPrettyModel>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

function MenuFormatForm() {

    const [menuPrettyModel, setMenuPrettyModel] = useState<MenuPrettyModel>({
        title: "My menu", backgroundColor: "white", textColor: "black", textFont: "Calibri", drinks: [], alcoholicLabel: true, alcoholicTextColor: ""
    });

    const previousMenu = usePreviousMenuPrettyModel(menuPrettyModel); // allows us to track what actually changed in the object

    if (menuPrettyModel.drinks.length === 0) { // populate the pretty drinks
        const location = useLocation();
        let id = location.state.id;
        get(
            "/cocktail_api/full_menu", {
            menuId: id
        },
            (res: any) => {
                res.data.menu_items.map((item:any, index:number) => {
                    setMenuPrettyModel(
                        (prev: MenuPrettyModel) => {
                            let obj = {...prev};

                            let items = obj.drinks;

                            if(items.length >= res.data.menu_items.length) return obj;

                            items.push(
                                {
                                    number: index, 
                                    drink: item.recipe
                                }
                            )

                            return obj;
                        }
                    )
                });
            }
        )
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
                        <h5>Menu Format Form</h5>
                        <form >
                            <div className="card m-3">
                                <div className="card-body border-bottom">
                                </div>
                            </div>
                        </form>
                    </div>

                </Grid>

                <Grid className="split-screen" item xs={5.8}>
                    <MenuPrettyDetails data={menuPrettyModel} />
                </Grid>
            </Grid>

            <button>Reset</button>
            <button>Save</button>
            <button>Format</button>
        </div>
    );
}

export default MenuFormatForm;
