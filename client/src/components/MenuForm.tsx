import React, { useEffect } from 'react';
import './App.css';
import { Button, Grid, Slider } from '@mui/material';
import { Label } from '@mui/icons-material';
import MenuDetails from './MenuDetails';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export interface menu {
  title: string,
  drinks: any[] // string of drink ids
}

export interface menuModel {
  menu: menu,
  size: number,
  numAlcoholic: number,
  numdrinksPerLiquor: Map<string, number>, // liquor, num of drinks,
  numDrinksPerCategory: Map<string, number>, // category, num of drinks
  veto: string[]
}

function MenuForm() {
  // form validation rules will go here
  const validationSchema = Yup.object().shape({
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, control, handleSubmit, reset, formState, watch } = useForm(formOptions);
  const { fields, append, remove } = useFieldArray({ name: 'numDrinksPerLiquor', control });

  const numberOfDrinks = watch('numberOfDrinks');

  useEffect(() => {
    const newVal = parseInt(numberOfDrinks || 0);
    const oldVal = fields.length;
    if (newVal > oldVal) {
      // append tickets to field array
      for (let i = oldVal; i < newVal; i++) {
        append({ liquor: '', number: 0 });
      }
    } else {
      // remove tickets from field array
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfDrinks]);

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
                      <label>Number of Drinks</label>
                      <select {...register('numberOfDrinks')}>
                        {['', 1, 5, 10, 15, 25, 30].map(i =>
                          <option key={i} value={i}>{i}</option>
                        )}
                      </select>
                    </div>
                  </div>
                  {fields.map((item, i) => (
                    <div key={i} className="list-group list-group-flush">
                      <div className="list-group-item">
                        <h5 className="card-title">Drink {i + 1}</h5>
                        <div className="form-row">
                          <div className="form-group col-6">
                            <label>Liquor</label>
                            <input />
                          </div>
                          <div className="form-group col-6">
                            <label>Number</label>
                            <input />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
