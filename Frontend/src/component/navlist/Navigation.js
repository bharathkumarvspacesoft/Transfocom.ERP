import React from "react";
import { useState } from "react";
import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom";
import classes from "./Navigation.module.css";
import navItems from "./navdata";
import Footer from "./Footer";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Divider } from "@mui/material";
import {accessMap} from'./navdata'

const Navigation = () => {
  const [isChildMenu, setChildMenu] = useState([]);
  const [isSubChildMenu, setSubChildMenu] = useState([]);
  const [storeItem, setStoreItem] = useState([]);
  const types= localStorage.getItem('type')
  const navData=accessMap[types] || []
  const handleSubmenu = (data) => {
    setChildMenu(data || []);
  };

  const handleChildSubmenu = (newData) => {
    setSubChildMenu(newData || []);
    setStoreItem(isChildMenu);
    setChildMenu([]);
  };

  const backToMainMenu = () => {
    setChildMenu([]);
  };

  const backToSubMenu = () => {
    setSubChildMenu([]);
    setChildMenu(storeItem);
    setStoreItem([]);
  };

  return (
    <>
      {isChildMenu.length ? (
        <nav className={classes.nav}>
          <SubMenu
            backToMainMenu={backToMainMenu}
            handleChildSubmenu={handleChildSubmenu}
            childrenItems={isChildMenu}
          />
        </nav>
      ) : isSubChildMenu.length ? (
        <nav className={classes.nav}>
          <ChildSubmenu
            backToSubMenu={backToSubMenu}
            subchildrenItems={isSubChildMenu}
          />
        </nav>
      ) : (
        <nav className={classes.nav}>
          <ul>
            {navData.map((navItem, uniq) => {
              return (
                <CustomLink
                  key={uniq + 1}
                  handleSubmenu={handleSubmenu}
                  childrenItems={navItem.children || undefined}
                  to={!navItem.children ? navItem.to : "#"}
                >
                  {" "}
                  {navItem.icon}
                  {navItem.label}
                  {navItem.arrow}
                </CustomLink>
              );
            })}
          </ul>
        </nav>
      )}

      <Footer />
    </>
  );
};

export default Navigation;

const CustomLink = ({
  to,
  children,
  childrenItems,
  handleSubmenu,
  handleChildSubmenu,
  ...props
}) => {
  const { pathname } = useLocation();
  const resolvedPath = useResolvedPath(to);
  let isActive = useMatch({ path: resolvedPath.pathname });
  if (!isActive && pathname.startsWith(to)) {
    isActive = true;
  }

  return (
    <li className={isActive && to !== "#" ? classes.active : ""}>
      <Link
        onClick={() => childrenItems && handleSubmenu(childrenItems)}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </li>
  );
};

const SubMenu = ({ childrenItems, backToMainMenu, handleChildSubmenu }) => {
  return (
    <ul>
      <Link onClick={backToMainMenu} to="#" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          
          startIcon={<KeyboardBackspaceIcon />}
          sx={{ background:"#3489d1"}
          }
        >
          main menu
        </Button>
      </Link>
      <br />
      <br />
      <Divider variant="middle" />
      {childrenItems.map((item, uniq) => {
        return (
          <SubLink
            key={uniq + 1}
            onClick={() =>
              item.sub_children && handleChildSubmenu(item.sub_children)
            }
            to={item.to}
          >
            {item.label}
            {item.arrow}
          </SubLink>
        );
      })}
    </ul>
  );
};

const ChildSubmenu = ({ subchildrenItems, backToSubMenu }) => {
  return (
    <ul>
      <Link onClick={backToSubMenu} to="#" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          color="warning"
          startIcon={<KeyboardBackspaceIcon />}
        >
          Back-menu
        </Button>
      </Link>
      <br />
      <br />
      <Divider variant="middle" />
      {subchildrenItems.map((item, uniq) => {
        return (
          <ChildSubLink key={uniq + 1} to={item.to}>
            {item.label}
          </ChildSubLink>
        );
      })}
    </ul>
  );
};

const SubLink = ({ to, children, ...props }) => {
  const { pathname } = useLocation();
  const resolvedPath = useResolvedPath(to);
  let isActive = useMatch({ path: resolvedPath.pathname });
  if (!isActive && pathname.startsWith(to)) {
    isActive = true;
  }

  return (
    <li className={isActive && to !== "#" ? classes.active : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
};

const ChildSubLink = ({ to, children, ...props }) => {
  const { pathname } = useLocation();
  const resolvedPath = useResolvedPath(to);
  let isActive = useMatch({ path: resolvedPath.pathname });
  if (!isActive && pathname.startsWith(to)) {
    isActive = true;
  }

  return (
    <li className={isActive && to !== "#" ? classes.active : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
};
