import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { del, get } from "../axios.service";
import { Menu } from "../models";
import MenuRawDetails from "./MenuRawDetails";
import { baseServerUrl } from '../axios.service';
import ImageQRCode from "./ImageQRCode";


export default () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [ menuInfo, setMenuInfo ] = useState<Menu | undefined>(undefined);

    useEffect(() => {
        if (menuInfo) return;
        get(
            "/cocktail_api/full_menu",
            {menuId: location.state.id},
            (response) => setMenuInfo(response.data as Menu)
        );
    }, [menuInfo]);

    const handleViewDesignedMenu = () => {
        window.open(`${baseServerUrl}/image/display?imageId=${menuInfo ? menuInfo.image_id || "" : ""}`, "_blank");
    }

    const handleCreateNewDesignedMenu = () => {
        navigate("/wow", { state: { id: location.state.id } })
    }

    const handleDeleteMenu = () => {
        del(`/menu_gen/delete_menu?menuId=${location.state.id}`, {}, () => {
            navigate("/profile");
        });
    }
    
    return (
        <div style={{display: "grid", gridTemplateColumns: "50% 50%"}}>
            <div>
                {menuInfo && <MenuRawDetails data={{
                    title: menuInfo.title,
                    menuRecipes: menuInfo.menu_items ? menuInfo.menu_items.map((item) => item.recipe).filter((item) => item) : [],
                    disableComponentNameDisplay: true
                }}/>}
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
                {menuInfo && menuInfo.image_id && <Button onClick={handleViewDesignedMenu} style={{backgroundColor: "rgba(0, 0, 0, 0.03)"}}>View Designed Menu</Button>}
                <Button onClick={handleCreateNewDesignedMenu} style={{backgroundColor: "rgba(0, 0, 0, 0.03)"}}>Create New Designed Menu</Button>
                <Button onClick={handleDeleteMenu} style={{color: "red", backgroundColor: "rgba(0, 0, 0, 0.03)"}}>Delete Menu</Button>
                {menuInfo && menuInfo.image_id && <ImageQRCode imageId={menuInfo.image_id} ></ImageQRCode>}
            </div>
        </div>
    );
}