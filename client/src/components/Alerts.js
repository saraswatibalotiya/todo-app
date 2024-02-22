import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const Alerts = ({ message, severitys ,onClose}) => {
    const [open, setOpen] = useState(true);
    console.log(message)
    console.log(severitys)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        onClose(); 
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity={severitys}>
                {/* <AlertTitle>{severitys === 'warning' ? 'Success' : 'Warning'}</AlertTitle> */}
                {message}
            </Alert>
        </Snackbar>
    );
}

export default Alerts;
