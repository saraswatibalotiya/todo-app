import React  from 'react'

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

const CustomDialog = ({ open, handleClose ,handleCancel ,handleDelete , itemName ,actionName}) => {
  return (
    
    <div>
        <Dialog  open = {open} onClose={handleClose}>
            <DialogTitle>Delete Todo</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You are about to delete <strong>{itemName}</strong>.If you proceed this action the Todoer will permanently delete the <i>{actionName || 'TODO'} </i>and recovery is not possible.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color='secondary' onClick={handleDelete}>Delete</Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </div>
  )
}

export default CustomDialog;
