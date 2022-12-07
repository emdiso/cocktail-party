import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Divider } from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styling/Profile.css';
import { get } from '../axios.service';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { CustomRecipe, Menu, UserInfo } from '../models';
import MenuWidget from './MenuWidget';
import RecipeCard from './RecipeCard';
import AddIcon from '@mui/icons-material/Add';

interface profileProps {
    userInfo: UserInfo;
}

const logOut = () => {
    localStorage.clear();
    window.location.reload();
    window.location.href = '/';
}

const Profile = (props: profileProps) => {
    const navigate = useNavigate();
    const [ crList, setCrList ] = useState<CustomRecipe[]>([]);
    const [ menuList, setMenuList ] = useState<Menu[]>([]);

    useEffect(() => {
        if (crList.length > 0) return;
        get('/cocktail_api/list_custom_recipes', {}, (response: AxiosResponse) => {
            setCrList(response.data);
        });
    }, [crList]);

    useEffect(() => {
        if (menuList.length > 0) return;
        get('/cocktail_api/my_menus', {}, (response: AxiosResponse) => {
            setMenuList(response.data);
        });
    }, [menuList]);

    const handleViewMenuClick = (menuId: number) => {
        navigate("/menu", { state: { id: menuId }});
    }

    return (
        <Container className='profile'>
            <Row className='logoutBtn'> <Button onClick={logOut} color="secondary" variant="contained"> Log Out </Button> </Row>

            <Container className='userInfo'>
                <Row className='username'> {props.userInfo.username} </Row>
                <Row className='email'> {props.userInfo.email} </Row>
            </Container>

            <Divider style={{marginBottom:"2vw"}} />

            <Container className='recipes'>
                <Row>
                    <Col sm={2}> My Recipes </Col> <Col> <Link to='/recipe'> <Button variant="contained" color="secondary"><AddIcon/></Button> </Link> </Col>
                </Row>
                <Row>
                    {crList && crList.length > 0 && crList.map((cr, index) => {
                        return <Col className='menusCol' sm={3} ><RecipeCard data={cr} key={index} /></Col>;
                    })}
                </Row>
            </Container>

            <Divider style={{marginBottom:"2vw"}} />

            <Container className='menus' >
                <Row>
                    <Col sm={2}> My Menus </Col> <Col> <Button variant="contained" color="secondary"><AddIcon/></Button> </Col>
                </Row>
                <Row>
                    {menuList && menuList.length > 0 && menuList.map((menu, index) => {
                        return <Col className='menusCol' sm={3} ><MenuWidget menu={menu} handleViewMenuClick={() => handleViewMenuClick(menu.id)} key={index} /></Col>;
                    })}
                </Row>
            </Container>
        </Container>
    );
}

export default Profile;