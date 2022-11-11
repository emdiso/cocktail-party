import * as React from 'react';
import Button, { FilledInput, IconButton, InputAdornment, InputLabel } from '@mui/material';
import { Label, Visibility, VisibilityOff } from '@mui/icons-material';
import TextField from '@mui/material/TextField';

interface State {
    username: string;
    password: string;
    showPassword: boolean;
}

const LoginForm = () => {

    const [values, setValues] = React.useState<State>({
        username: '',
        password: '',
        showPassword: false,
    });
    
    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
        // -TODO-
    }

    return (
        <div>
            <InputLabel htmlFor='username-input'> Username </InputLabel>
            <TextField id='username-input' variant='outlined' value={values.username} />
            
            <InputLabel htmlFor="password-input"> Password </InputLabel>

            {/* <TextField
                id ="password-input"
                variant='outlined'
                value={values.password}
                type={values.showPassword ? 'text' : 'password'}
                onChange={handleChange('password')}>
            </TextField>
            
            <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton> */}

            <FilledInput
                id="filled-password"
                type={values.showPassword ? 'text' : 'password'}
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