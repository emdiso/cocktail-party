import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, FormControl, FormControlLabel, FormLabel, Grid, List, ListItem, ListItemAvatar, ListItemText, Radio, RadioGroup, Tooltip } from '@mui/material';
import MenuPrettyDetails from '../MenuPrettyDetails';
import { CustomRecipe } from '../../models';
import { get } from '../../axios.service';
import { useLocation } from 'react-router-dom';
import InputColor from 'react-input-color';
import recipe from '../../models/Recipe';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

export const useStrictDroppable = (loading: boolean) => {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        let animation: any;

        if (!loading) {
            animation = requestAnimationFrame(() => setEnabled(true));
        }

        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, [loading]);

    return [enabled];
};

export interface PrettyDrink {
    id: string, //strDrink
    drink: recipe | CustomRecipe,
}

export interface MenuPrettyModel {
    title: string,
    backgroundColor: string,
    textColor: string,
    textFont: string,
    drinks: PrettyDrink[]
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

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;
const DrinkList = styled.div`
  padding: 8px;
`;

function MenuFormatForm() {
    const location = useLocation();
    let id = location.state.id;

    const [menuPrettyModel, setMenuPrettyModel] = useState<MenuPrettyModel>({
        title: "My menu", backgroundColor: "#c4c0c0ff", textColor: "#000000ff", textFont: "Calibri", drinks: [], alcoholicLabel: true, alcoholicTextColor: "#000000ff"
    });

    const [alcoholicColorWheel, setAlcoholicColorWheel] = useState<Boolean>(false);

    const previousMenu = usePreviousMenuPrettyModel(menuPrettyModel); // allows us to track what actually changed in the object
    const [enabled] = useStrictDroppable(false);

    const fonts: string[] = [
        "Arial",
        "Helvetica",
        "Verdana",
        "Gill Sans",
        "Times New Roman",
        "Georgia",
        "Andale Mono",
        "Courier New",
        "Bradley Hand",
        "Snell Roundhand",
        "Marker Felt",
        "Trattatello"
    ];

    const handleReset = () => {
        setMenuPrettyModel(
            (prev: any) => {
                let obj = { ...prev };
                obj.drinks = [];
                return obj;
            }
        );
    };

    const handleUndo = () => {
        setMenuPrettyModel(previousMenu!);
    };

    const handleSubmit = () => {
        // create the qr code stuff 
    }

    React.useEffect(() => {
        if (menuPrettyModel.drinks.length > 0) return;
        // else populate

        get(
            "/cocktail_api/full_menu", {
            menuId: id
        },
            (res: any) => {
                res.data.menu_items.map((item: any, index: number) => {
                    setMenuPrettyModel(
                        (prev: MenuPrettyModel) => {
                            let obj = { ...prev };

                            obj.title = res.data.title;
                            let items = obj.drinks;

                            if (items.length >= res.data.menu_items.length) return obj;

                            items.push(
                                {
                                    id: item.recipe.strDrink,
                                    drink: item.recipe
                                }
                            )

                            return obj;
                        }
                    )
                });
            }
        )

    }, [menuPrettyModel])


    const setBackgroundColor = (e: any) => {
        setMenuPrettyModel(
            (prev: MenuPrettyModel) => {
                let obj = { ...prev };
                obj.backgroundColor = e.hex;
                return obj;
            }
        );
    }

    const setTextColor = (e: any) => {
        setMenuPrettyModel(
            (prev: MenuPrettyModel) => {
                console.log(prev);
                let obj = { ...prev };
                obj.textColor = e.hex;

                if (obj.alcoholicLabel) {
                    obj.alcoholicTextColor = e.hex;
                }

                return obj;
            }
        );
    }

    const setFont = (e: any) => {
        setMenuPrettyModel(
            (prev: MenuPrettyModel) => {
                let obj = { ...prev };
                obj.textFont = e.target.value;
                return obj;
            }
        );
    }

    const onDragEnd = (e: any) => {
        let itemId = e.draggableId;
        let destinationIndex = e.destination.index;
        let sourceIndex = e.source.index;

        setMenuPrettyModel(
            (prev: MenuPrettyModel) => {
                let obj = { ...prev };

                let drinks = obj.drinks;
                let itemToMove = drinks.filter(x => { return x.id === itemId })[0];

                // remove the item from the list
                obj.drinks.splice(sourceIndex, 1);
                // put the item in the list at the right index
                obj.drinks.splice(destinationIndex, 0, itemToMove);

                return obj;
            }
        )
    };

    const setAlcoholicLabel = (e: any) => {
        setMenuPrettyModel(
            (prev: MenuPrettyModel) => {
                let obj = { ...prev };

                switch (e.target.value) {
                    case "false":
                        obj.alcoholicLabel = false;
                        setAlcoholicColorWheel(true);
                        break;
                    case "true":
                        obj.alcoholicLabel = true;
                        break
                }

                return obj;
            }
        );
    }

    const setAlcoholicTextColor = (e: any) => {
        setMenuPrettyModel(
            (prev: MenuPrettyModel) => {
                let obj = { ...prev };
                obj.alcoholicTextColor = e.hex;

                console.log(obj);
                return obj;
            }
        );
    }

    return (
        <div>
            <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="stretch">
                <Grid item xs={5.8} >

                    <div>
                        <h5>Menu Format Form</h5>
                        <div className="card m-3">
                            <div className="card-body border-bottom">
                                <form>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Background Color: </label>
                                            <InputColor
                                                key={"background"}
                                                initialValue={menuPrettyModel.backgroundColor}
                                                onChange={setBackgroundColor}
                                                placement="right"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Text Color: </label>
                                            <InputColor
                                                key={"text"}
                                                initialValue={menuPrettyModel.textColor}
                                                onChange={setTextColor}
                                                placement="right"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Text Font: </label>
                                            <select onChange={setFont} value={menuPrettyModel.textFont}>
                                                {fonts.map(i =>
                                                    <option key={i} value={i}>{i}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Drag and drop to re-order the drinks: </label>
                                            <DragDropContext
                                                onDragEnd={onDragEnd}
                                            >
                                                {enabled && <Droppable droppableId='0'>
                                                    {provided => (
                                                        <DrinkList
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                        >
                                                            {menuPrettyModel.drinks.map((prettyDrink: PrettyDrink, i: number) =>
                                                                <Draggable draggableId={prettyDrink.id} index={i} key={prettyDrink.id}>
                                                                    {(provided) => (
                                                                        <Container
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            ref={provided.innerRef}
                                                                        >
                                                                            <p>{prettyDrink.id}</p>
                                                                        </Container>
                                                                    )}
                                                                </Draggable>
                                                            )}
                                                            {provided.placeholder}
                                                        </DrinkList>
                                                    )}
                                                </Droppable>
                                                }
                                            </DragDropContext>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <FormControl>
                                                <FormLabel id="demo-controlled-radio-buttons-group">
                                                    I want to know the drinks contain alcohol by:
                                                </FormLabel>
                                                <RadioGroup
                                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                                    name="controlled-radio-buttons-group"
                                                    value={menuPrettyModel.alcoholicLabel}
                                                    onChange={setAlcoholicLabel}
                                                >
                                                    <FormControlLabel value="true" control={<Radio />} label="Label them please!" />
                                                    <FormControlLabel value="false" control={<Radio />} label="Change their color!" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                    </div>

                                    {alcoholicColorWheel ?
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Alcoholic Text Color: </label>
                                                <InputColor
                                                    key={"alcoholic-text"}
                                                    initialValue="#FF0000"
                                                    onChange={setAlcoholicTextColor}
                                                    placement="right"
                                                />
                                            </div>
                                        </div>
                                        :
                                        <></>
                                    }

                                </form>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleUndo} variant="contained" color="error" sx={{ mt: 1, mr: 1 }}>
                        Undo
                    </Button>
                    <Button onClick={handleReset} variant="contained" color="error" sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                    <Tooltip title="Save to my profile">
                        <Button onClick={handleSubmit} variant="contained" sx={{ mt: 1, mr: 1 }}>Submit</Button>
                    </Tooltip>
                </Grid>

                <Grid className="split-screen" item xs={5.8}>
                    <MenuPrettyDetails data={menuPrettyModel} />
                </Grid>
            </Grid>
        </div>
    );
}

export default MenuFormatForm;