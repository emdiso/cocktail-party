import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material';
import React from 'react';
import { getIn } from 'yup/lib/util/reach';

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

export function getIngredients(data: any){
    let ingredients: string[] = [];
    for (let i = 1; i < 16; i++) {
        if (data.data[`strIngredient${i}`])
            ingredients.push(data.data[`strIngredient${i}`])
    }
    return ingredients;
}

function RecipeCard(data: any) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    let ingredients: string[] = getIngredients(data);

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader title={data.data.strDrink} />
            <CardMedia
                component="img"
                height="194"
                image={data.data.strDrinkThumb}
                alt="Recipe img not available"
            />
            <CardContent>
                Ingredients: {ingredients}
            </CardContent>
            <CardActions disableSpacing>
                <button>Modify</button>
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
        </Card>
    );
}

export default RecipeCard;
