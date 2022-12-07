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
    const [menuInfo, setMenuInfo] = useState<Menu | undefined>(undefined);

    useEffect(() => {
        if (menuInfo) return;
        get(
            "/cocktail_api/full_menu",
            { menuId: location.state.id },
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

    const handleBack = () => {
        navigate("/profile");
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "70% 30%" }}>
            <div>
                {menuInfo && <MenuRawDetails data={{
                    title: menuInfo.title,
                    menuRecipes: menuInfo.menu_items ? menuInfo.menu_items.map((item) => item.recipe).filter((item) => item) : [],
                    disableComponentNameDisplay: true
                }} />}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="card m-3">
                    <div className="card-body border-bottom">
                        {menuInfo && menuInfo.image_id && <div style={{ width: "55%", margin:"auto", paddingBottom:"2vw" }}><ImageQRCode imageId={menuInfo.image_id}></ImageQRCode></div>}
                        {menuInfo && menuInfo.image_id && <Button onClick={handleViewDesignedMenu} variant="contained" color="secondary" style={{ marginBottom: "2vw", width: "55%" }}>View Design</Button>}
                        <Button onClick={handleCreateNewDesignedMenu} variant="contained" color="secondary" style={{ marginBottom: "2vw", width: "55%" }}>New Design</Button>
                        <Button onClick={handleDeleteMenu} variant="contained" color="error" style={{ marginBottom: "2vw", width: "55%" }}>Delete Menu</Button>
                    </div>
                    <Button onClick={handleBack} variant="contained" color="secondary">Back</Button>
                </div>
            </div>
        </div>
    );
}