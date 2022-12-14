import * as React from 'react';
import { Button, FilledInput, IconButton, InputAdornment, InputLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import { makeLoggedInTrue, post, setAuthToken } from '../../axios.service';
import { AxiosError, AxiosResponse } from 'axios';

export interface SignupInfo {
    username: string;
    email: string;
    password: string;
    showPassword: boolean;
}

export interface SignupFormProps {
    handleClose: () => void;
}

const SignupForm = (props: SignupFormProps) => {
    const [values, setValues] = React.useState<SignupInfo>({
        username: '',
        email: '',
        password: '',
        showPassword: false,
    });

    const [displayUNError, setDisplayUNError] = React.useState<boolean>(false);
    const [displayEMLError, setDisplayEMLError] = React.useState<boolean>(false);
    const [displayPWError, setDisplayPWError] = React.useState<boolean>(false);

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
        post('/auth/signup', 
            {
                username: values.username,
                email: values.email,
                password: values.password,
            }, {}, (response: AxiosResponse) => {
                setAuthToken(response.data.accessToken);
                setDisplayUNError(false);
                setDisplayEMLError(false);
                setDisplayPWError(false);
                props.handleClose();
                makeLoggedInTrue();
            }, (error: AxiosError) => {
                if (error.response && error.response.data === 'Invalid username') {
                    setDisplayUNError(true);
                    setDisplayEMLError(false);
                    setDisplayPWError(false);
                }
                if (error.response && error.response.data === 'Invalid email') {
                    setDisplayUNError(false);
                    setDisplayEMLError(true);
                    setDisplayPWError(false);
                }
                if (error.response && error.response.data === 'Invalid password') {
                    setDisplayUNError(false);
                    setDisplayEMLError(false);
                    setDisplayPWError(true);
                }
            });
    }

    return (
        <div>
            <div className="card m-3">
                <div className="card-body border-bottom">
                    <InputLabel htmlFor='username-input'> Username </InputLabel>
                    <TextField
                        required
                        id='username-input'
                        variant='filled'
                        value={values.username}
                        onChange={handleChange('username')}
                    />
                    {displayUNError && <p className='error-message' style={{ color: "red" }}> Invalid username. <br></br>Please make sure your username is 5-30 characters in length. </p>}

                    <InputLabel htmlFor='email-input'> Email </InputLabel>
                    <TextField
                        required
                        id='email-input'
                        variant='filled'
                        value={values.email}
                        onChange={handleChange('email')}
                    />
                    {displayEMLError && <p className='error-message' style={{ color: "red" }}> Invalid email. </p>}

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
                    {displayPWError && <p className='error-message' style={{ color: "red" }}> Invalid password. <br></br>Passwords must include a special character and be 8-30 characters in length. </p>}

                    <div style={{ paddingTop: "2vw" }}>
                        <Button onClick={handleSubmit} variant="contained" color="secondary"> Sign Up </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupForm;