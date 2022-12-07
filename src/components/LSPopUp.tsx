import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import LoginForm from './forms/LoginForm';
import SignupForm from './forms/SignupForm';


interface LSPopUpProps {
    open: boolean;
    handleClose: () => void;
}

const LSPopUp = (props: LSPopUpProps) => {
    const [displayLI, displayLogin] = React.useState(true);

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogActions>
                    <ButtonGroup variant="text" aria-label="text button group" color="secondary">
                        <Button onClick={()=>displayLogin(true)}> Log-In </Button>
                        <Button onClick={()=>displayLogin(false)}> Sign-Up </Button>
                    </ButtonGroup>
                </DialogActions>
                {displayLI ? (<LoginForm handleClose={props.handleClose} />) : (<SignupForm handleClose={props.handleClose}/>)}
            </Dialog>
        </div>
    )
};

export default LSPopUp;