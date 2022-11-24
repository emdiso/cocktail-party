import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './../styling/MenuForms.css';
import { Box, Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material';
import MenuRawDetails from '../MenuRawDetails';
import { get, post } from '../../axios.service';
import { AxiosResponse } from 'axios';
import Select from '@mui/material/Select';

export interface Quantity {
  id: number,
  item: string,
  amount: number
}

export interface MenuModel {
  menuDrinks: any[],
  size: number,
  alcoholicQuantity: number,
  ingriedientsYes: string[],
  ingriedientsNo: string[]
}

interface StepModel {
  title: string,
  html: ReactNode
}

function usePreviousMenuModel(value: MenuModel) {
  const ref = useRef<MenuModel>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function MenuForm() {

  const [menuModel, setMenuModel] = useState<MenuModel>({
    menuDrinks: [], size: 0, alcoholicQuantity: 0, ingriedientsYes: [], ingriedientsNo: []
  });

  const previousMenu = usePreviousMenuModel(menuModel);
  const [ingredientOptions, setIngredientOptions] = useState<string[]>([]);
  const [ingredientsYesChanged, setIngredientsYesChanged] = useState<Boolean>(false);
  const [ingredientsNoChanged, setIngredientsNoChanged] = useState<Boolean>(false);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setMenuModel({ menuDrinks: [], size: 0, alcoholicQuantity: 0, ingriedientsYes: [], ingriedientsNo: [] });
    setActiveStep(0);
  };

  const handleSubmit = () => {
    post("/cocktail_api/insert_full_menu", {}, {}, () => {
      // TODO: Do something with returned menu id
    });
    handleReset();
  }

  const menuSizeSelected = (e: any) => {
    let size = Number(e.target.value);
    get(
      "/menu_gen/menu_by_size", { "size": size },
      (res: AxiosResponse) => {
        setMenuModel((prev: MenuModel) => {
          let obj = { ...prev };
          obj.size = size;
          obj.menuDrinks = res.data;

          let alcoholic = res.data.filter(function (item: any) {
            return item.strAlcoholic.includes("Alcoholic");
          })
          obj.alcoholicQuantity = alcoholic.length;

          return obj;
        });
      })

    get(
      "/cocktail_api/ingredient_options", {},
      (res: AxiosResponse) => {
        res.data.drinks.forEach((ingriedient: any) => {
          setIngredientOptions(
            (prev: string[]) => {
              let obj = [...prev];
              obj.push(ingriedient.strIngredient1);
              return obj;
            }
          );
        });
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

  const handleChangeIngriedientsYes = (event: any) => {
    const {
      target: { value },
    } = event;

    setMenuModel(
      (prev: MenuModel) => {
        let obj = { ...prev };

        let stringify = String(value);
        obj.ingriedientsYes = stringify.split(",");
        setIngredientsYesChanged(true);
        return obj;
      }
    );
  };

  const handleChangeIngriedientsNo = (event: any) => {
    const {
      target: { value },
    } = event;

    setMenuModel(
      (prev: MenuModel) => {
        let obj = { ...prev };

        let stringify = String(value);
        obj.ingriedientsNo = stringify.split(",");
        setIngredientsNoChanged(true);
        return obj;
      }
    );
  };

  React.useEffect(() => {
    if (previousMenu && previousMenu.alcoholicQuantity !== menuModel.alcoholicQuantity) {
      post(
        '/menu_gen/modify_menu_by_alcoholic', menuModel, {},
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

    if (previousMenu && ingredientsYesChanged) {
      post(
        '/menu_gen/add_drink_with_ingredient', menuModel, {},
        (res: AxiosResponse) => {
          console.log(res.data);
          setMenuModel(
            (prev: MenuModel) => {
              let obj = { ...prev };
              obj.menuDrinks = res.data.menuDrinks;
              return obj;
            }
          );
          setIngredientsYesChanged(false);
        }
      )
    }

    if (previousMenu && ingredientsNoChanged) {
      post(
        '/menu_gen/remove_drink_with_ingredient', menuModel, {},
        (res: AxiosResponse) => {
          console.log(res.data);
          setMenuModel(
            (prev: MenuModel) => {
              let obj = { ...prev };
              obj.menuDrinks = res.data.menuDrinks;
              return obj;
            }
          );
          setIngredientsNoChanged(false);
        }
      )
    }

  }, [menuModel]);

  const steps: StepModel[] = [
    {
      title: "Generate drinks",
      html:
        <div className="form-row">
          <div className="form-group">
            <label>Number of drinks to generate: </label>
            <select onChange={menuSizeSelected} value={menuModel.size}>
              {[0, 1, 5, 10, 15, 25, 30].map(i =>
                <option key={i} value={i}>{i}</option>
              )}
            </select>
          </div>
        </div>
    },
    {
      title: "How many generated drinks should contain alcohol?",
      html:
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
    },
    {
      title: "Want us to generate a drink by ingredient?",
      html:
        <div>
          <FormControl sx={{ m: 1, width: 350 }}>
            <InputLabel id="demo-multiple-chip-label">Ingriedients</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={menuModel.ingriedientsYes}
              onChange={handleChangeIngriedientsYes}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {ingredientOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={menuModel.ingriedientsYes.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
    },
    {
      title: "Want us to remove a generated drink by ingredient?",
      html:
        <div>
          <FormControl sx={{ m: 1, width: 350 }}>
            <InputLabel id="demo-multiple-chip-label">Ingriedients</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={menuModel.ingriedientsNo}
              onChange={handleChangeIngriedientsNo}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {ingredientOptions.filter((element) => {
                return !menuModel.ingriedientsYes.includes(element);
              }).map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={menuModel.ingriedientsNo.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
    },
    {
      title: "Add your drinks to the menu",
      html:
        <div>
          <p>cj do ur code here, im on line 293 in MenuForm.tsx</p>
        </div>
    }
  ]

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="stretch">
        <Grid item xs={5.8} >
          <div>
            <h5>Menu Form</h5>
            <Box className="card m-3">
              <Stepper activeStep={activeStep} orientation="vertical" style={{ width: "100%" }}>
                {steps.map((step, index) => (
                  <Step key={step.title}>
                    <StepLabel
                      optional={
                        index === 4 ? (
                          <Typography variant="caption">Last step</Typography>
                        ) : null
                      }
                    >
                      {step.title}
                    </StepLabel>
                    <StepContent>
                      {step.html}
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                            variant="outlined"
                          >
                            Back
                          </Button>
                          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }} variant="outlined">
                            Reset
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                  <Typography>All steps completed - you&apos;re finished</Typography>
                  <Button onClick={handleSubmit} variant="outlined">Submit</Button>
                  <Button onClick={handleReset} variant="outlined">Reset</Button>
                  <Button variant="outlined">Design</Button>
                </Paper>
              )}
            </Box>
          </div>
        </Grid>

        <Grid item xs={5.8}>
          <MenuRawDetails data={menuModel.menuDrinks} />
        </Grid>
      </Grid>

    </div >
  );
}

export default MenuForm;