import { Card, Typography, CardContent, CardActions, Button, Divider } from '@mui/material';
import React from 'react';
import { Menu } from '../models';
import './styling/App.css';


interface MenuWidgetProps {
    menu: Menu;
}

export default (props: MenuWidgetProps) => {
    return (
        <Card style={{height: "100%", display: "flex", justifyContent: "space-between", flexDirection: "column"}}>
            <CardContent style={{height: "auto"}}>
                <div style={{display: "flex", justifyContent:"space-between", marginRight: "0.5rem"}}>
                    <Typography style={{width: "50%", textAlign: "left"}} >
                        {props.menu.title}
                    </Typography>
                    <Divider orientation='vertical' flexItem style={{width: "8%", borderColor: "rgba(0, 0, 0, 0.3)"}} />
                    <Typography style={{width: "25%", textAlign: "center"}}>
                    Items: {props.menu.item_count}
                    </Typography>
                </div>
            </CardContent>
            <Divider style={{borderColor: "rgba(0, 0, 0, 0.3)"}} />
            <CardActions style={{marginTop: "auto"}}>
                <Button size="small">View Menu</Button>
            </CardActions>
        </Card>
    );
};