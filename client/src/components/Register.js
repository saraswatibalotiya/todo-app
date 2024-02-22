import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import '../Register.css'; // Import the CSS file\
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs'
import Alerts from './Alerts';
import { useNavigate } from 'react-router-dom';  // Import useHistory from react-router-dom
import Header from './Header';
import Footer from './Footer';


const Register = () => {

    const url = 'http://localhost:5500';
    const navigate = useNavigate();

    //Alert
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const validateEmail = (email) => {
        // Regular expression for validating an Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleClose = () =>{
        setShowAlert(false)
        setAlertMessage('')
        setAlertSeverity('')
    }
    const emptyFields = (e) => {
        setAlertSeverity('warning');
        setShowAlert(true);
        e.target.username.value = '';
        e.target.email.value = '';
        e.target.password.value = '';
    }
    const addUser = async (e) => {
        try {
            e.preventDefault();
            const username = e.target.username.value;
            const email = e.target.email.value;
            const password = e.target.password.value;
            if (username === '' || email === '' || password === '') {
                setAlertMessage('Enter all details');
                emptyFields(e);
                return;
            }
            if(!validateEmail(email)){
                setAlertMessage('Enter proper email address');
                emptyFields(e);
                return;
            }
            if(password.length != 8){
                setAlertMessage('Password length must be atleast 8 characters');
                emptyFields(e);
                return;
            }
            
            const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            const res = await axios.post(`${url}/api/user`, { username: username, email: email, password: hashPassword });
            console.log(res.data);
            if(res.data === 'Username exist'){
                setAlertMessage('Username exist');
                emptyFields(e);
                return;
            }
            setAlertMessage('Registeration done successfully!');
            setAlertSeverity('success');
            setShowAlert(true);
            setTimeout(() => {
                navigate(`/login`);
            }, 1000); // Adjust the delay as needed
        } catch (error) {
            console.log(error);
            throw (error);
        }
    }
    return (
        <>
        <Header/>
        <div className='Register'>
            <h1>Registration Page</h1>
            <Box
                onSubmit={(e) => { addUser(e) }}
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                className='form'
            >
                <p style={{ width: "50ch" }}>Username</p>
                <input type='text' placeholder="Enter Username" name='username' fullWidth />
                <p style={{ width: "50ch" }}>Email</p>
                <input type='text' placeholder="Enter Email" name='email' fullWidth />
                <p style={{ width: "50ch" }}>Password</p>
                <input type='password' placeholder="Enter Password" name='password'  />
                <Button type="submit" variant="contained" color="secondary">Register</Button>
                <RouterLink to="/login">Click here to Login</RouterLink>

                {showAlert && (
                    <Alerts message={alertMessage} severitys={alertSeverity} onClose={() => {handleClose()}} />
                )}
            </Box>

        </div>

        <Footer/>
        </>

       
    );
}

export default Register;
