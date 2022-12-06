import * as React from 'react';
import Button, { FilledInput, IconButton, InputAdornment, InputLabel } from '@mui/material';
import { Cookie, Label, Visibility, VisibilityOff } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import {post, setAuthToken, get} from '../../axios.service';
import { AxiosError, AxiosResponse } from 'axios';

interface LoginInfo {
    username: string;
    password: string;
    showPassword: boolean;
}

interface LoginFormProps {
    handleClose: () => void;
}

const LoginForm = (props: LoginFormProps) => {

    const [values, setValues] = React.useState<LoginInfo>({
        username: '',
        password: '',
        showPassword: false,
    });

    const [displayError, setDisplayError] = React.useState<boolean>(false);
    
    const handleChange =
        (prop: keyof LoginInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
        post('/auth/login', 
            {
			    username : values.username,
                password : values.password
		    }, {}, (response: AxiosResponse) => {
                setAuthToken(response.data.accessToken);
                props.handleClose();
                window.location.reload();
            });
    }

    return (
        <div>
            {displayError && <p id='error-message'>Invalid username or password. Please try again.</p>}
            <InputLabel htmlFor='username-input'> Username </InputLabel>
            <TextField
                required id='username-input'
                variant='filled'
                value={values.username} 
                onChange={handleChange('username')}
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

            <button onClick={handleSubmit}> Log In </button> 
        </div>
      );
}

export default LoginForm;