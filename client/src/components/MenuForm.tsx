import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, Grid, Slider } from '@mui/material';
import { Label, Liquor } from '@mui/icons-material';
import MenuDetails from './MenuDetails';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { watch } from 'fs';
import { get } from '../axios.service';

export interface menu {
  title: string,
  drinks: any[] // string of drink ids
}

export interface menuModel {
  menu: menu,
  size: number,
  numAlcoholic: number,
  liquorList: Map<string, number>, // liquor, num of drinks,
  categoryList: Map<string, number>, // category, num of drinks
  vetoList: string[]
}

function MenuForm() {
  const { register, watch, getValues } = useForm<menuModel>();

  const watchMenuSize = watch("size", 0);

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(value, name, type);
      get("/menu_by_size", {"size" : value.size })
        .then(
          (response: any) => {
            console.log(response);
          }
        )
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // const liquorReadyFields = () => {

  //   return liquorList.map((item, i) => (
  //     <div key={i} className="list-group list-group-flush">
  //       <div className="list-group-item">
  //         <div className="form-row">
  //           <div className="form-group col-6">
  //             <label>Liquor</label>
  //             <input defaultValue={item.liquor} />
  //           </div>

  //           <div className="form-group col-6">
  //             <label>Amount</label>
  //             <select>
  //               {[].map(i =>
  //                 <option key={i} value={i}>{i}</option>
  //               )}
  //             </select>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   ));

  // }

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
                      <select {...register('size', {
                        required: true
                      })}>
                        {[0, 1, 5, 10, 15, 25, 30].map(i =>
                          <option key={i} value={i}>{i}</option>
                        )}
                      </select>
                    </div>
                  </div>

                </div>
              </div>
            </form>
          </div>
        </Grid>

        <Grid className="split-screen" item xs={5.8}>
          <MenuDetails />
        </Grid>
      </Grid>

      <button>Reset</button>
      <button>Download</button>
      <button>Format</button>
    </div>
  );
}

export default MenuForm;
