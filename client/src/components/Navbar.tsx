import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export interface link {
  link: string,
  text: string
}

const Navbar = () => {

  const pages: link[] = [
    { link: "/", text: "Home" }, { link: "/random", text: "Random drink" }, { link: "/generate", text: "Make me a menu" }
  ]

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cocktail Party
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((link: link, index: number) => (
                <Link to={link.link}>
                  <Button
                    key={index}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {link.text}
                  </Button>
                </Link>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
};

export default Navbar;