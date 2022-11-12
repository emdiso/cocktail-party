import * as React from 'react';
import Button, { FilledInput, IconButton, InputAdornment, InputLabel } from '@mui/material';
import { Label, Visibility, VisibilityOff } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import {post} from '../../axios.service';

interface SignupInfo {
    username: string;
    email: string;
    password: string;
    showPassword: boolean;
}

const SignupForm = () => {
    const [values, setValues] = React.useState<SignupInfo>({
        username: '',
        email: '',
        password: '',
        showPassword: false,
    });

    const handleChange =
        (prop: keyof SignupInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
        };
    
    const handleClickShowPassword = () => {
        setValues({
        ...values,
        showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = () => {
        const response = post('/signup', 
            {
			    username : values.username,
                email : values.email,
                password : values.password
		    }, {});

        // -TODO- Implement Storing AccessToken on browser local storage
    }

    return (
        <div>
            <InputLabel htmlFor='username-input'> Username </InputLabel>
            <TextField
                required
                id='username-input'
                variant='filled'
                value={values.username} 
                onChange={handleChange('username')}
            />

            <InputLabel htmlFor='email-input'> Email </InputLabel>
            <TextField
                required
                id='email-input'
                variant='filled'
                value={values.email} 
                onChange={handleChange('email')}
            />
            
            <InputLabel htmlFor="filled-password"> Password </InputLabel>
            <FilledInput
                id="filled-password"
                type={values.showPassword ? 'text' : 'password'}
                required                
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />

            <button onClick={handleSubmit}> Sign Up </button> 
        </div>
    )
}

export default SignupForm;