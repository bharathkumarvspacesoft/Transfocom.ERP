import { Backdrop, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 100199999999999 }}>
    <CircularProgress color='inherit' />
  </Backdrop>
}

export default LoadingSpinner;
