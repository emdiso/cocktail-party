import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../axios.service";
import { Menu } from "../models";
import MenuRawDetails from "./MenuRawDetails";


export default () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [ menuInfo, setMenuInfo ] = useState<Menu | undefined>(undefined);

    useEffect(() => {
        if (menuInfo) return;
        get(
            "/cocktail_api/full_menu",
            {menuId: location.state.id},
            (response) => setMenuInfo(response.data)
        );
    }, [menuInfo]);

    const handleViewDesignedMenu = () => {
        window.open(`http://localhost:3001/image/display?imageId=${menuInfo ? menuInfo.image_id || "" : ""}`, "_blank");
    }

    const handleCreateNewDesignedMenu = () => {
        navigate("/wow", { state: { id: location.state.id } })
    }

    const handleDeleteMenu = () => {
        // TODO
    }
    
    return (
        <div>
            {/** Emily you can adjust these button names, Ik you prob don't like them */}
            {menuInfo && menuInfo.image_id && <Button onClick={handleViewDesignedMenu}>View Designed Menu</Button>}
            <Button onClick={handleCreateNewDesignedMenu}>Create New Designed Menu</Button>
            <Button>Delete Menu</Button>
            {menuInfo && <MenuRawDetails data={{ title: menuInfo.title, menuRecipes: menuInfo.menu_items ? menuInfo.menu_items.map((item) => item.recipe) : [] }}/>}
        </div>
    );
}