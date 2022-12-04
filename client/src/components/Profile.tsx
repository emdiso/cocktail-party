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
import { Menu } from '../models';
import MenuWidget from './MenuWidget';

interface profileProps {
    userInfo: UserInfo;
}

const logOut = () => {
    localStorage.clear();
    window.location.reload();
    window.location.href = '/';
}

const Profile = (props: profileProps) => {
    // <link
    //     rel="stylesheet"
    //     href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
    //     integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
    // />

    const [ menuList, setMenuList ] = useState<Menu[]>([]);

    useEffect(() => {
        console.log(menuList);
        if (menuList.length > 0) return;
        get('/cocktail_api/my_menus', {}, (response: AxiosResponse) => {
            setMenuList(response.data);
        });
    }, [menuList])

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
                <Row> Recipes will be loaded here </Row>
            </Container>

            <Container className='menus' >
                <Row>
                    <Col sm={2}> My Menus </Col> <Col> <Button> + </Button> </Col>
                </Row>
                <Row>
                    {menuList && menuList.length > 0 && menuList.map((menu) => {
                        return <Col className='menusCol' sm={3} ><MenuWidget menu={menu} /></Col>
                    })}
                </Row>
            </Container>
        </Container>
    );
}

export default Profile;