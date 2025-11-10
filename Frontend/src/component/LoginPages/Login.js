import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from 'react-router-dom';
import { APP_BASE_PATH } from 'Host/endpoint';
import { useDispatch } from 'react-redux';
import './LoginPage.css'; 
import Swal from 'sweetalert2';
import logo from "../../assert/logo.png";
import logobanner from "../../assert/login-banner.png";
import InputAdornment from '@mui/material/InputAdornment';
const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    name: '',
    password: '',
    rememberMe: false,
  });
  const navigate = useNavigate();

  const fetchOptions = {
  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${APP_BASE_PATH}/login`, {
        ...fetchOptions,
        body: JSON.stringify(value),
      });

      if (response.ok) {
        const data = await response.json();
console.log(data)
        if (data.Status === 'Success') {
          console.log('Login successful');
          dispatch({ type: 'login' });
          console.log(data.type, data.id);
          localStorage.setItem('token', `token=${data.token}; path=/`);
          navigate('/dashboard');
          localStorage.setItem('userData', JSON.stringify({ type: data.type, id: data.id }));
          localStorage.setItem('type', data.type);
          localStorage.setItem('UserName', data.Username);
          localStorage.setItem('ContactNo', data.ContactNo);
        } else {
          Swal.fire({
            title: 'Credentials Do Not Match!',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: 'red',
          });
        }
      } else {
        console.error('Failed to fetch');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Something went wrong!',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="login-container">
    <Container maxWidth="md" className="center-container" >
      <div className='rows'>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7} >
          
          <img src={logobanner} alt="logobanner" style={{width:'90%'}} />
        </Grid>
        <Grid item xs={12} lg={5} className="center-content" >
          <Grid container >
            <Grid item xs={12}>
              <img src={logo} alt="logo" style={{marginRight:'40%'}} />
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                <Grid item xs={11}>
  <div className="login-row row no-margin" style={{marginTop:'10px'}}>
    <TextField
      type="text"
      label="User Name"
      variant="standard"
      fullWidth
      value={value.name}
      onChange={(e) => setValue({ ...value, name: e.target.value })}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MailOutlineIcon />
          </InputAdornment>
        ),
      }}
    />
  </div>
</Grid>
                  <Grid item xs={11}>
                    <div className="login-row row no-margin">
                      
                      <TextField
     type='password'
      label="Password"
      variant="standard"
      fullWidth
      value={value.password}
      onChange={(e) => setValue({ ...value, password: e.target.value })}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon />
          </InputAdornment>
        ),
      }}
    />

                    </div>
                  </Grid>
                 
                  <Grid item xs={11}>
                  <div className="login-row btnroo row no-margin" style={{ maxWidth: '35%', marginLeft: '30%' }}>
  <Button
    variant="contained"
    style={{
      backgroundColor: '#00d284',
      color: 'white',
      borderRadius: '17px', // Adjust the radius as needed
    }}
    type="submit"
    disabled={loading}
    className="custom-button"
  >
    {loading ? 'Loading...' : 'Sign In'}
  </Button>
</div>

                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </div>
    </Container>
    </div>
    </>
  );
};

export default Login;
