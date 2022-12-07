import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ImageListItem, ImageListItemBar, styled } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { baseServerUrl } from '../axios.service';


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

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

function RecipeCard(data: any) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
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
                {(data.data.strDrinkThumb || data.data.image_id) && <img
                    src={data.data.strDrinkThumb || `${baseServerUrl}/image/display?imageId=${data.data.image_id}`}
                    loading="lazy"
                />}
                <ImageListItemBar
                    title={data.data.strDrink}
                    subtitle={getIngredients(data.data)}
                    actionIcon={
                        <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            aria-label={`info about ${data.data.strDrink}`}
                        >
                        </IconButton>
                    }
                />
            </ImageListItem>
            {/* <Card sx={{ maxWidth: 345 }}>
                <CardHeader title={data.data.strDrink} />
                {(data.data.strDrinkThumb || data.data.image_id) && <CardMedia
                    component="img"
                    height="194"
                    image={data.data.strDrinkThumb || `${baseServerUrl}/image/display?imageId=${data.data.image_id}`}
                    alt=""
                />}
                <CardContent>
                    Ingredients: {ingredients.join(", ")}
                </CardContent>
                <CardActions disableSpacing>
                    <button onClick={handleModify}>Modify</button>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Recipe:</Typography>
                        <Typography paragraph>
                            {data.data.strInstructions}
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card> */}
        </div>
    );
}

export default RecipeCard;
