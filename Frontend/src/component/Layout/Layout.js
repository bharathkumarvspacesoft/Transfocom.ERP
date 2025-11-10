import React from "react";
import Header from '../Header/Header';
import Navigation from "../navlist/Navigation";
import classes from "./Layout.module.css";

const Layout = (WrappedComponent) => {
  return () => {
    return (
      <>
        <Header />
        {/* <div className={classes["left-panel"]}>
          <Navigation />
        </div> */}
        <div className={classes["right-panel"]} >
          <main className={classes.main}>
            <WrappedComponent />
          </main>
        </div>
      </>
    );
  };
};

export default Layout;
