import React from 'react'
import {Typography, Modal, Stack,Button,Box, useTheme} from '@mui/material'

function DeleteDialog(props) {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const {dialogOpen,setDialogOpen,handleConfirmDelete, windowW} = props;
  return (
    <>
        <Modal
          open={dialogOpen}
          onClose={()=>setDialogOpen(false)}
          aria-labelledby="confirm deletion"
          aria-describedby="confirm delete dialog"
        >
          <Stack sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {tablet: 400, mobile: windowW - 32},
            borderRadius: '8px',
            bgcolor: dark,
            p: 4,
            '& > * + *': {mt: "16px !important"}
          }}>
            <Typography variant='dialogHeader'>
              Delete comment
            </Typography>
            <Typography variant="body" sx={{ display: 'block'}}>
              Are you sure you want to delete this comment? This will remove the comment and can't be undone.
            </Typography>
            <Box sx={{display: 'flex', height: 48, '& *':{fontWeight: 500, fontSize: '14px'} }}>
              <Button 
                onClick={()=>setDialogOpen(false)} 
                aria-label="cancel delete document" 
                variant='contained' 
                size='large'
                disableElevation
                sx={{'&, &:hover':{flexGrow: 1,bgcolor: dark},borderRadius: '8px',px: 0 }}
              >
                NO, CANCEL
              </Button>
              <Button 
                onClick={handleConfirmDelete} 
                aria-label="confirm delete document" 
                variant='contained' 
                size='large'
                disableElevation
                sx={{'&, &:hover':{flexGrow: 1,bgcolor: dark}, ml: 1.5,borderRadius: '8px',px: 0 }}
              >
                YES, DELETE
              </Button>
            </Box>
          </Stack>
        </Modal>
    </>
  )
}

export default DeleteDialog