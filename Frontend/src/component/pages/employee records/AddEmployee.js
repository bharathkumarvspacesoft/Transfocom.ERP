import React from 'react'
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import "./employee.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from '@mui/icons-material/Dashboard';
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3.5),
    color: theme.palette.text.primary,
    fontWeight: 500,
    
    marginLeft: 10,
    fontSize: "15px",
    "&:hover, &:focus": {
      backgroundColor: "orange",
      color: "white",
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const AddEmployee = () => {
  return (
    <>
      <div role="presentation" id="breadcrumb">
        <Breadcrumbs aria-label="breadcrumb" style={{ marginTop: 10 }}>
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Dashboard"
            icon={<DashboardIcon fontSize="small" />}
          />
          <StyledBreadcrumb component="a" href="#" label="Account" />
          <StyledBreadcrumb label="Employee Record" deleteIcon={<ExpandMoreIcon />} />
          <StyledBreadcrumb label="Add Employee" deleteIcon={<ExpandMoreIcon />} />
        </Breadcrumbs>
      </div>
      <br />

    <div>
      <h3>hello this is a Add Employee page</h3>
    </div>
    </>
  )
}

export default AddEmployee
