import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, ImageListItem, ImageListItemBar, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, styled } from '@mui/material';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseServerUrl } from '../axios.service';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { blue } from '@mui/material/colors';

export interface InstructionObject {
    strIngredient: string,
    strMeasurement: string
}

function getIngredients(data: any) {
    let ingredients: string[] = [];
    for (let i = 1; i < 16; i++) {
        if (data[`strIngredient${i}`]) {
            let ingredient = data[`strIngredient${i}`];
            ingredients.push(`${ingredient}, `)
        }
    }
    const ingredientsLength = ingredients.length;
    // lol this line gets rid of the comma at the end
    if (ingredientsLength > 0)
        ingredients[ingredientsLength - 1] = ingredients[ingredientsLength - 1].substring(0, ingredients[ingredientsLength - 1].length - 2);
    return ingredients;
}

function getInstructionObjects(data: any): InstructionObject[] {
    let obj: InstructionObject[] = [];

    for (let i = 1; i < 16; i++) {
        if (data[`strIngredient${i}`]) {
            let ingredient = data[`strIngredient${i}`];
            let measurement = data[`strMeasure${i}`];
            obj.push({
                strIngredient: ingredient,
                strMeasurement: measurement
            });
        }
    }

    return obj;
}

export interface SimpleDialogProps {
    open: boolean;
    data: any,
    onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, data, open } = props;

    const handleClose = () => {
        onClose();
    };

    const objects = getInstructionObjects(data);

    return (
        <Dialog onClose={handleClose} open={open} disableAutoFocus={false}>
            <DialogTitle>Recipe for {data.strDrink}</DialogTitle>
            <DialogContent title="Ingredients">
                <h6>Ingredients</h6>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} >
                    {objects.map((obj: InstructionObject, index: number) => (
                        <div>
                            <ListItem alignItems="center">
                                <ListItemText
                                    primary={`${index + 1}. ${obj.strIngredient}`}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {obj.strMeasurement}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            </DialogContent>
            <DialogContent title='Instructions'>
                <h6>Instructions</h6>
                {data.strInstructions}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

function RecipeCard(data: any) {
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    const handleModify = () => {
        if (data.data.idDrink) {
            navigate('/recipe', { state: { id: 0, idDrink: data.data.idDrink } });
        }
        else {
            navigate('/recipe', { state: { id: data.data.id, idDrink: 0 } });
        }
    }

    return (
        <div>
            <ImageListItem key={data.data.strDrink}>
                {(data.data.strDrinkThumb || data.data.image_id) ?
                    <img
                        src={data.data.strDrinkThumb || `${baseServerUrl}/image/display?imageId=${data.data.image_id}`}
                        loading="lazy"
                    /> :
                    <img
                        src="img/default.jpeg"
                        loading="lazy"
                    />
                }
                <ImageListItemBar
                    title={data.data.strDrink}
                    subtitle={getIngredients(data.data)}
                    actionIcon={
                        <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            aria-controls={openMenu ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openMenu ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    }
                />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleModify}>Modify</MenuItem>
                    <MenuItem onClick={handleClickOpen}>See Recipe</MenuItem>
                    {data.data.id && <MenuItem>Delete</MenuItem>}
                </Menu>
                <SimpleDialog
                    open={openDialog}
                    data={data.data}
                    onClose={handleCloseDialog}
                />
            </ImageListItem>
        </div>
    );
}

export default RecipeCard;
