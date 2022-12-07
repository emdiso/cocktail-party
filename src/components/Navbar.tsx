import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Fab } from '@mui/material';
import { UserInfo } from '../models';


export interface link {
  link: string,
  text: string
}

interface NavbarProps {
  isLoggedIn: boolean;
  handleOpen: ()=>void;
  userInfo: UserInfo;
}

const Navbar = (props: NavbarProps) => {

  const pages: link[] = [
    { link: "/", text: "Home" }, { link: "/random", text: "Random drink" }, { link: "/generate", text: "Make a menu" }
  ]

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{backgroundColor: "#480080"}}>
          <Toolbar style={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant="h6">
              Cocktail Party
            </Typography>
            <Box sx={{display: "flex"}}>
              {pages.map((link: link, index: number) => (
                <Link to={link.link} key={index+20} style={{color:"transparent"}}>
                  <Button
                    key={index}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {link.text}
                  </Button>
                </Link>
              ))}
            </Box>
            {props.isLoggedIn ?
                <Link to="/profile" style={{color:"transparent"}}>
                  <Fab variant="extended" size="small">
                    {props.userInfo.username}
                  </Fab>
                </Link>
              :
                <Fab variant="extended" onClick={props.handleOpen} size="small">
                  Log In
                </Fab>
            }
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
};

export default Navbar;