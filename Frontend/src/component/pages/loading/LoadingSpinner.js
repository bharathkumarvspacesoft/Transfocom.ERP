import React from 'react'
import { Backdrop, CircularProgress } from '@mui/material';


const LoadingSpinner = () => {
  return (
     <Backdrop open={true} sx={{ color: '#f7690b', zIndex: (theme) => theme.zIndex.drawer + 1001 }}>
    <CircularProgress color='inherit' />
  </Backdrop>
  )
}

export default LoadingSpinner
