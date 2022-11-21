import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button, Grid, Slider } from '@mui/material';
import MenuPrettyDetails from '../MenuPrettyDetails';
import { Drink } from '../Random';
import { MenuModel } from './MenuForm';
import { useLocation } from 'react-router-dom';

export interface PrettyDrink {
    number: number,
    drink: Drink,
    color: string,
}

export interface MenuPrettyModel {
    title: string,
    backgroundColor: string,
    drinks: PrettyDrink[] // string of drink ids
}

function usePreviousMenuPrettyModel(value: MenuPrettyModel) {
    const ref = useRef<MenuPrettyModel>();
    useEffect(() => {
        ref.current = value; //assign the value of ref to the argument
    }, [value]); //this code will run when the value of 'value' changes
    return ref.current; //in the end, return the current ref value.
}

function MenuFormatForm(id: any) {

    const populatePretty = () => {
        // get menu from database 
        // create a pretty drink object for each of menu's drinks
        return [];
    }

    const [menuPrettyModel, setMenuPrettyModel] = useState<MenuPrettyModel>({
        title: "My menu", backgroundColor: "white", drinks: populatePretty()
    });

    const previousMenu = usePreviousMenuPrettyModel(menuPrettyModel); // allows us to track what actually changed in the object

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
