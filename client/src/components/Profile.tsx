import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserInfo } from './App';
import './styling/Profile.css';
import { get } from '../axios.service';
import { Link } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { CustomRecipe, Menu } from '../models';
import MenuWidget from './MenuWidget';
import RecipeCard from './RecipeCard';

interface profileProps {
    userInfo: UserInfo;
}

const logOut = () => {
    localStorage.clear();
    window.location.reload();
    window.location.href = '/';
}

const Profile = (props: profileProps) => {
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

    return (
        <Container className='profile'>
            <Row className='logoutBtn'> <Button onClick={logOut}> Log Out </Button> </Row>

            <Container className='userInfo'>
                <Row className='username'> {props.userInfo.username} </Row>
                <Row className='email'> {props.userInfo.email} </Row>
            </Container>

            <Container className='recipes'>
                <Row>
                    <Col sm={2}> My Recipes </Col> <Col> <Link to='/recipe'> <Button> + </Button> </Link> </Col>
                </Row>
                <Row>
                    {crList && crList.length > 0 && crList.map((cr, index) => {
                        return <Col className='menusCol' sm={3} ><RecipeCard data={cr} key={index} /></Col>;
                    })}
                </Row>
            </Container>

            <Container className='menus' >
                <Row>
                    <Col sm={2}> My Menus </Col> <Col> <Button> + </Button> </Col>
                </Row>
                <Row>
                    {menuList && menuList.length > 0 && menuList.map((menu, index) => {
                        return <Col className='menusCol' sm={3} ><MenuWidget menu={menu} key={index} /></Col>;
                    })}
                </Row>
            </Container>
        </Container>
    );
}

export default Profile;