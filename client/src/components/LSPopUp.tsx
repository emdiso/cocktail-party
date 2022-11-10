import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoginForm from './forms/LoginForm';


const LSPopUp = () => {
    const [open, setOpen] = React.useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const [displayLI, displayLogin] = React.useState(true);
    //const [displaySI, displaySignup] = React.useState(false);

    const openLogin = () => {
        displayLogin(true);
        //displaySignup(false);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogActions>
                <ButtonGroup variant="text" aria-label="text button group">
                    <Button onClick={openLogin}> Log-In </Button>
                    <LoginForm/>
                    {/* <Button onClick={}> Sign-Up </Button> */}
                </ButtonGroup>
                </DialogActions>
            </Dialog>
        </div>
    )
};

export default LSPopUp;