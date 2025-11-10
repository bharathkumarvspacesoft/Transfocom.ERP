import Divider from "@mui/material/Divider";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={classes.mainFooter}>
      <Divider />
      <p>
        TransfocoM <br /> {new Date().getFullYear()} &copy; All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
