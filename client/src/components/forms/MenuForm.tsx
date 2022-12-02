import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './../styling/MenuForms.css';
import { Box, Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Step, StepContent, StepLabel, Stepper, TextField, Tooltip, Typography } from '@mui/material';
import MenuRawDetails from '../MenuRawDetails';
import { get, post } from '../../axios.service';
import { AxiosResponse } from 'axios';
import Select from '@mui/material/Select';
import { CustomRecipe, Recipe } from '../../models';

export interface MenuGenModel {
  title: string;
  menuRecipes: Recipe[];
  menuCustomRecipes: CustomRecipe[];
  size: number;
  alcoholicQuantity: number;
  ingriedientsYes: string[];
  ingriedientsNo: string[];
}

interface StepModel {
  title: string,
  html: ReactNode
}

function usePreviousMenuGenModel(value: MenuGenModel) {
  const ref = useRef<MenuGenModel>();
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

  const [menuGenModel, setMenuGenModel] = useState<MenuGenModel>({
    title: "", menuRecipes: [], menuCustomRecipes: [], size: 0, alcoholicQuantity: 0, ingriedientsYes: [], ingriedientsNo: []
  });

  const previousMenu = usePreviousMenuGenModel(menuGenModel);
  const [ingredientOptions, setIngredientOptions] = useState<string[]>([]);
  const [ingredientsYesChanged, setIngredientsYesChanged] = useState<Boolean>(false);
  const [ingredientsNoChanged, setIngredientsNoChanged] = useState<Boolean>(false);
  const [myCustomRecipes, setMyCustomRecipes] = useState<CustomRecipe[] | undefined>(undefined);

  useEffect(() => {
    if (myCustomRecipes !== undefined) return;
    get("/cocktail_api/list_custom_recipes", {}, (response) => {
      setMyCustomRecipes(response.data.custom_recipes);
    });
  }, [myCustomRecipes]);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setMenuGenModel({ title: "", menuRecipes: [], menuCustomRecipes: [], size: 0, alcoholicQuantity: 0, ingriedientsYes: [], ingriedientsNo: [] });
    setActiveStep(0);
  };

  const handleUndo = () => {
    setMenuGenModel(previousMenu!);
  };

  const handleSubmit = () => {
    post("/menu_gen/insert_full_menu", {
      title: menuGenModel.title,
      recipes: (menuGenModel.menuRecipes as (Recipe | CustomRecipe)[]).concat(menuGenModel.menuCustomRecipes)
    }, {}, (response: AxiosResponse) => {
      // TODO: Do something with returned menu id (for example link them to the menu page after we build it)
      // console.log("Menu id: "+response.data.menu_id.toString());
      handleReset();
    }, () => {
      // TODO: Announce that they need to be logged in to submit/save the menu
    });
  }

  const setMenuTitle = (e: any) => {
    setMenuGenModel((prev: MenuGenModel) => {
      let obj = { ...prev };
      obj.title = e.target.value;

      return obj;
    });
  };

  React.useEffect(() => {
    if (ingredientOptions.length > 0) return;
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
  }, [ingredientOptions]);

  const menuSizeSelected = (e: any) => {
    let size = Number(e.target.value);
    get(
      "/menu_gen/menu_by_size", { "size": size },
      (res: AxiosResponse) => {
        setMenuGenModel((prev: MenuGenModel) => {
          let obj = { ...prev };
          obj.size = size;
          obj.menuRecipes = res.data;

          let alcoholic = res.data.filter(function (item: any) {
            return item.strAlcoholic.includes("Alcoholic");
          })
          obj.alcoholicQuantity = alcoholic.length;

          return obj;
        });
      })
  }

  const setMenuGenModelAlcoholicQuantity = (e: any) => {
    setMenuGenModel(
      (prev: MenuGenModel) => {
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

    setMenuGenModel(
      (prev: MenuGenModel) => {
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

    setMenuGenModel(
      (prev: MenuGenModel) => {
        let obj = { ...prev };

        let stringify = String(value);
        obj.ingriedientsNo = stringify.split(",");
        setIngredientsNoChanged(true);
        return obj;
      }
    );
  };

  const handleChangeCustomRecipes = (event: any) => {
    const {
      target: { value },
    } = event;

    setMenuGenModel(
      (prev: MenuGenModel) => {
        let obj = { ...prev };

        obj.menuCustomRecipes = !myCustomRecipes ? [] : myCustomRecipes.filter((cr) => {
          return value.includes(cr.id);
        });
        return obj;
      }
    );
  };

  React.useEffect(() => {
    if (previousMenu && previousMenu.alcoholicQuantity !== menuGenModel.alcoholicQuantity) {
      post(
        '/menu_gen/modify_menu_by_alcoholic', menuGenModel, {},
        (res: AxiosResponse) => {
          setMenuGenModel(
            (prev: MenuGenModel) => {
              let obj = { ...prev };
              obj.menuRecipes = res.data.menuRecipes;
              return obj;
            }
          );
        }
      )
    }

    if (previousMenu && ingredientsYesChanged) {
      post(
        '/menu_gen/add_drink_with_ingredient', menuGenModel, {},
        (res: AxiosResponse) => {
          setMenuGenModel(
            (prev: MenuGenModel) => {
              let obj = { ...prev };
              obj.menuRecipes = res.data.menuRecipes;
              return obj;
            }
          );
          setIngredientsYesChanged(false);
        }
      )
    }

    if (previousMenu && ingredientsNoChanged) {
      post(
        '/menu_gen/remove_drink_with_ingredient', menuGenModel, {},
        (res: AxiosResponse) => {
          setMenuGenModel(
            (prev: MenuGenModel) => {
              let obj = { ...prev };
              obj.menuRecipes = res.data.menuRecipes;
              return obj;
            }
          );
          setIngredientsNoChanged(false);
        }
      )
    }

  }, [menuGenModel]);

  const steps: StepModel[] = [
    {
      title: "Menu Title",
      html:
        <div>
          <TextField onChange={setMenuTitle} value={menuGenModel.title} />
        </div>
    },
    {
      title: "Generate drinks",
      html:
        <div className="form-row">
          <div className="form-group">
            <label>Number of drinks to generate: </label>
            <select onChange={menuSizeSelected} value={menuGenModel.size}>
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
            <select onChange={setMenuGenModelAlcoholicQuantity} value={menuGenModel.alcoholicQuantity}>
              {menuGenModel.menuRecipes.map((item: any, i: number) =>
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              )}
            </select>
            <h5 style={{ fontSize: "12px" }}>{menuGenModel.alcoholicQuantity} drinks contain alcohol, {menuGenModel.menuRecipes.length - menuGenModel.alcoholicQuantity} are kid friendly.</h5>
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
              value={menuGenModel.ingriedientsYes}
              onChange={handleChangeIngriedientsYes}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {ingredientOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={menuGenModel.ingriedientsYes.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <h5 style={{ color: "red", fontSize: "12px" }}>Disclaimer: this may affect your alcoholic quantity based on what you choose. <br></br>You can always undo your choice, with the undo button.</h5>
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
              value={menuGenModel.ingriedientsNo}
              onChange={handleChangeIngriedientsNo}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {ingredientOptions.filter((element) => {
                return !menuGenModel.ingriedientsYes.includes(element);
              }).map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={menuGenModel.ingriedientsNo.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <h5 style={{ color: "red", fontSize: "12px" }}>Disclaimer: this may affect your alcoholic quantity based on what you choose. <br></br>You can always undo your choice, with the undo button.</h5>
        </div>
    },
    {
      title: "Add your drinks to the menu",
      html:
        <div>
          {myCustomRecipes === undefined ? (<p>Login to add your Custom Recipes</p>) : (
            <FormControl sx={{ m: 1, width: 350 }}>
              <InputLabel id="custom-recipe-select-label">Custom Recipes</InputLabel>
              <Select
                labelId="custom-recipe-select-label"
                multiple
                value={menuGenModel.menuCustomRecipes.map((cr: CustomRecipe) => cr.id)}
                onChange={handleChangeCustomRecipes}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.length + " Selected"}
                MenuProps={MenuProps}
              >
                {myCustomRecipes.map((cr) => (
                  <MenuItem key={cr.id} value={cr.id}>
                    <Checkbox checked={menuGenModel.menuCustomRecipes.map((mcr: CustomRecipe) => mcr.id).includes(cr.id)} />
                    <ListItemText primary={cr.strDrink} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
                        index === 5 ? (
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
                            variant="contained"
                            size="small"
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                            size="small"
                          >
                            {index === steps.length - 1 ? 'Finish' : 'Continue'}
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Button onClick={handleUndo} variant="contained" color="error" sx={{ mt: 1, mr: 1 }}>
              Undo
            </Button>
            <Button onClick={handleReset} variant="contained" color="error" sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
            <Tooltip title="Design my menu">
              <Button variant="contained" sx={{ mt: 1, mr: 1 }}>Design</Button>
            </Tooltip>
            <Tooltip title="Save to my profile">
              <Button onClick={handleSubmit} variant="contained" sx={{ mt: 1, mr: 1 }}>Submit</Button>
            </Tooltip>
          </div>
        </Grid>

        <Grid item xs={5.8}>
          <MenuRawDetails data={{ title: menuGenModel.title, menuRecipes: (menuGenModel.menuRecipes as (Recipe | CustomRecipe)[]).concat(menuGenModel.menuCustomRecipes) }} />
        </Grid>
      </Grid>

    </div >
  );
}

export default MenuForm;