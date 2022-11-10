import * as React from 'react';
import Button from '@mui/material';
import { Label } from '@mui/icons-material';

const LoginForm = () => {

    return (
        <div>
            <form>
                <h1> Welcome Back! </h1>
                <textarea> Please enter your username and password. </textarea>
                <Label> 
                    Username: 
                    <input type='text' />
                </Label>

                <Label>
                    Password:
                    <input type="text" />
                </Label>
                <button> Log In </button>
            </form>
        </div>
      );
}

export default LoginForm;