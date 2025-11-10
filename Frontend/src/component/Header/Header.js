import React from "react";
import classes from "./Header.module.css";
import logo from "../img/Trading-School-Transparent.png";
import { Link, useNavigate } from "react-router-dom";
import HeaderNavigation from "component/navlist/HeaderNavigation";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios'
import { useDispatch } from "react-redux";
import { APP_BASE_PATH } from "Host/endpoint";


const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  // const handleDelete = () => {
    
  //   axios.get('http://localhost:3002/logout')
  //     .then((res) => {
  //       // window.location.reload(true);
  //       dispatch({type:'logout'})
  //       navigate("/");
        
  //     })
  //     .catch((err) => console.log(err));
  // };
  const handleDelete = () => {
    // Clear the token from cookies by setting its expiration date in the past
    localStorage.setItem('token', "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/");
    localStorage.removeItem('login');
    
    // Dispatch the logout action or handle the user's logout state as needed
    dispatch({ type: 'logout' });
    navigate("/");
  };
  return (
    <>
      <header className={classes.header}>
        <div className={classes.head}>
        <HeaderNavigation />
       
        <div className={classes.logo}>
 
    <img src={logo} alt=""/>
  
  <button onClick={handleDelete} className={classes.logoutButton}>
   
    <ExitToAppIcon />
  </button>
</div>

          
          {/* <div className={classes.quickMenu}>
                        <div>
                            <IconButton size='large' color='inherit' title='Notifications'>
                                <Badge badgeContent={5} color='warning'>
                                    <NotificationsIcon fontSize='30' />
                                </Badge>
                            </IconButton>
                        </div>
                        <Avatar className={classes.avatar} />

                    </div> */}
        </div>
      </header>
    </>
  );
};

export default Header;
