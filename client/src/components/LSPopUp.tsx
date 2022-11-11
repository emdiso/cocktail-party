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
                    <ButtonGroup variant="text" aria-label="text button group">
                        <Button onClick={()=>displayLogin(true)}> Log-In </Button>
                        <Button onClick={()=>displayLogin(false)}> Sign-Up </Button>
                    </ButtonGroup>
                </DialogActions>
                {displayLI ? (<LoginForm/>) : ("oop")}
            </Dialog>
        </div>
    )
};

export default LSPopUp;