import React, { useState } from "react";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import headerImage from "../../../assets/Untitled.png";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../Backdrop/Backdrop";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `url(${headerImage}) no-repeat`,
        backgroundSize: "100%",
      }}
    >
      {drawerIsOpen ? (
        <Backdrop onClick={() => setDrawerIsOpen(false)}></Backdrop>
      ) : null}
      
        <div className="main-navigation__side-drawer">
          <SideDrawer show={drawerIsOpen} onClick={()=>setDrawerIsOpen(false)}>
            <nav className="main-navigation__drawer-nav">
              <NavLinks />
            </nav>
          </SideDrawer>
        </div>
      
      <MainHeader>
        <div
          style={{ display: "flex", flexWrap: "wrap", flexDirection: "row" }}
        >
          <button
            className="main-navigation__menu-btn"
            onClick={() => setDrawerIsOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <div style={{margin: 'auto 0', padding: '20px'}}>
            <Link to="/">
              <h1
                style={{
                  color: "#d8d8d8",
                  fontFamily: "Courier New",
                  fontSize: "30px",
                }}
              >
                BawaGrm
              </h1>
            </Link>
          </div>
          <div className="main-navigation__header-nav">
            <nav>
              <NavLinks />
            </nav>
          </div>
        </div>
      </MainHeader>
    </div>
  );
};

export default MainNavigation;
