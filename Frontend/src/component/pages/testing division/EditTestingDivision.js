import React from "react";
import { useState, useEffect } from "react";
import { Button, IconButton } from "@mui/material";

import "./testing.css";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import Slide from "@mui/material/Slide";
import Swal from "sweetalert2";
import { APP_BASE_PATH } from "Host/endpoint";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function EditTesting({
  fetchData,
  division: div,
  open,
  setOpen,
}) {
  const [division, setDivision] = useState("");
  const [error, setError] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setDivision(div.division);
  }, [div]);

  const handleInputs = (e) => {
    let value = e.target.value;
    setDivision(value);
    setError({});
  };
  const handleClos = () => {
    setOpen(false);
  };

  const post = async (e) => {
    e.preventDefault();
    if (division) {
      const res = await fetch(`${APP_BASE_PATH}/testDivision`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          division,
          id: div.id,
        }),
      });
  
      const data = await res.json();
  
      if (res.status === 400 || !data) {
        Swal.fire({
          title: "Please Fill Data!!!!",
          icon: "error",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: true,
          confirmButtonColor: "red",
        });
      } else {
        Swal.fire({
          title: "Data Updated Successfully!!!!",
          icon: "success",
          iconHtml: "",
          confirmButtonText: "OK",
          animation: true,
          confirmButtonColor: "green",
        });
        fetchData();
      }
  
      handleClose();
    } else {
      setError({ division: "required" });
      Swal.fire({
        title: "Please Fill the Testing Division Field!!!!",
        icon: "error",
        iconHtml: "",
        confirmButtonText: "OK",
        animation: true,
        confirmButtonColor: "red",
      });
    }
  };
  

  return (
    <>
      <div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          aria-describedby="alert-dialog-slide-description"
          TransitionComponent={Transition}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Update Testing Division
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-slide-description">
              <Box style={{ marginLeft: 21 }}>
                <Grid container spacing={3}>
                  <Grid item xl={12} style={{ position: "relative" }}>
                    <TextField
                      style={{ width: 500 }}
                      fullWidth
                      id="division"
                      placeholder="Testing Division"
                      labelprope
                      name="division"
                      value={division}
                      onChange={handleInputs}
                    />
                    <span className="error-msg">{error.division}</span>
                  </Grid>
                </Grid>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{background: "#00d284",
              "&:hover": {
                background: "#00d284", // Set the same color as the default background
              },}}
              id="savebtnn"
              variant="contained"
              type="submit"
              onClick={post}
              // onClick={handleSubmit}
            >
              Save
            </Button>

            <Button sx={{background: "#ff0854",
                                    "&:hover": {
                                      background: "#ff0854", // Set the same color as the default background
                                    },}} id="closebtn" variant="contained" onClick={handleClos}>
              close
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
    </>
  );
}
