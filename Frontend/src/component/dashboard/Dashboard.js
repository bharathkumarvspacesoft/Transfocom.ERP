import React, { useEffect, useState } from 'react'
import "./dashboard.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import camera from "../img/camera.png";
import Report from "../img/Report.png";
import axios from "axios";
const Dashboard = () => {
  const [auth,setAuth] = useState(false)
  // const [message,setMessage] = useState("")
  // axios.defaults.withCredentials = true
  // useEffect(()=>{
  //   axios.get('http://localhost:3002')
  //   .then(res=>{
  //     if(res.data.Status === "Success"){
  //       setAuth(true)
        
  //     }else{
  //       setAuth(false)
  //       setMessage(res.data.Error)
  //     }
  //   })
  //   .then(err=>console.log(err))
  // },[])

  return (
    <>
      <div id="box">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-3">
              <Paper elevation={18} style={{ width: 235, height: 130 }}>
                <Box
                  sx={{
                    width: 235,
                    height: 130,
                    backgroundColor: "#409c0b",
                    marginTop: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 16 }}
                      color="white"
                      fontWeight={500}
                      gutterBottom
                    >
                      All Customer
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      color="white"
                      fontWeight={500}
                    >
                      300
                    </Typography>
                  </CardContent>
                </Box>
              </Paper>
            </div>
            <div className="col-md-3">
              <Paper elevation={18} style={{ width: 235, height: 130 }}>
                <Box
                  sx={{
                    width: 235,
                    height: 130,
                    backgroundColor: "#edda07",
                    marginTop: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 16 }}
                      color="white"
                      fontWeight={500}
                      gutterBottom
                    >
                      New Customer
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      color="white"
                      fontWeight={500}
                    >
                      200
                    </Typography>
                  </CardContent>
                </Box>
              </Paper>
            </div>
            <div className="col-md-3">
              <Paper elevation={18} style={{ width: 235, height: 130 }}>
                <Box
                  sx={{
                    width: 235,
                    height: 130,
                    backgroundColor: "#07b0ed",
                    marginTop: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 16 }}
                      color="white"
                      fontWeight={500}
                      gutterBottom
                    >
                      All Transaction
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      color="white"
                      fontWeight={500}
                    >
                      3000
                    </Typography>
                  </CardContent>
                </Box>
              </Paper>
            </div>
            <div className="col-md-3">
              <Paper elevation={18} style={{ width: 235, height: 130 }}>
                <Box
                  sx={{
                    width: 235,
                    height: 130,
                    backgroundColor: "#db0928",
                    marginTop: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 16 }}
                      color="white"
                      fontWeight={500}
                      gutterBottom
                    >
                      Pending Transaction
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      color="white"
                      fontWeight={500}
                    >
                      300
                    </Typography>
                  </CardContent>
                </Box>
              </Paper>
            </div>
          </div>
        </div>
      </div>
      <Box sx={{ width: "100%", marginTop: 8 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Paper elevation={18} style={{ position: "relative", left: 210 }}>
            <Grid item xs={6}>
              <img id="image" src={Report} alt="Report"></img>
            </Grid>
          </Paper>
          <Paper elevation={18} style={{ position: "relative", left: 270 }}>
            <Grid item xs={6}>
              <img id="image" src={camera} alt="camera"></img>
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
