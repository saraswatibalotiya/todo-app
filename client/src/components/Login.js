import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';  // Import useHistory from react-router-dom

import '../App.css'; // Import the CSS file\
import axios from 'axios';
import bcrypt from 'bcryptjs'
import Alerts from './Alerts';
import { v4 as uuidv4 } from 'uuid';
import Header from './Header';
import Footer from './Footer';

const Login = () => {
    const navigate = useNavigate();
    //Alert
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    const handleClose = () => {
        setShowAlert(false)
        setAlertMessage('')
        setAlertSeverity('')
    }

    const getUser = async (e) => {
        try {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
            if (password === '' || username === '') {
                setAlertMessage('Enter all details');
                setAlertSeverity('warning');
                setShowAlert(true);
                return;
            }
            const res = await axios.get(`http://localhost:5500/api/user?username=${username}`);
            console.log(res);
            const hashPassword = res.data[0].password;
            if (bcrypt.compareSync(password, hashPassword)) {
                // Generate a unique session ID
                const sessionId = uuidv4();
                // Save user data in sessionStorage
                sessionStorage.setItem(sessionId, JSON.stringify(res.data));
                setTimeout(() => {
                    navigate(`/todo/${sessionId}`);
                }, 1000); // Adjust the delay as needed
                return;

            } else {
                setAlertMessage('Invalid Password');
                setAlertSeverity('warning');
                setShowAlert(true);
                return;
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Handle 404 Not Found error
                setAlertMessage(error.response.data.error);
            } else if (error.response && error.response.status === 500) {
                // Handle 500 Internal Server Error
                setAlertMessage(error.response.data.error);
            } else {
                setAlertMessage('An error occurred');
            }
            setAlertSeverity('error');
            setShowAlert(true);    
        }
        e.target.username.value = '';
        e.target.password.value = '';
    }
    return (

        <>
        <Header/>

        <div className='Register'>
            <h1>Login Page</h1>
            <Box
                onSubmit={(e) => { getUser(e) }}
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                className='form'
            >
                <p style={{ width: "50ch" }}>Username</p>
                <input type='text'  placeholder="Enter Username" name='username'  />
                <p style={{ width: "50ch" }}>Password</p>
                <input type='password'  placeholder="Enter Password" name='password'  />
                <Button type="submit" variant="contained" color="secondary">Login</Button>
                <RouterLink to="/" className='registerText'>Click here for Registration</RouterLink>

                {showAlert && (
                    <Alerts message={alertMessage} severitys={alertSeverity} onClose={() => { handleClose() }} />
                )}
            </Box>
        </div>
        <Footer/>
        </>

    );
}

export default Login;
