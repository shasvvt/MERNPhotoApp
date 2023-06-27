import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";

const NavLinks = (props) => {
  const authContext = useContext(AuthContext);

  return (
    <ul
      className="nav-links"
      //style={{display: 'flex', flexDirection:'row', listStyle:'none'}}
    >
      <li
      //</ul>style={{padding:'30px'}}
      >
        <NavLink to="/" exact>
          <PeopleAltIcon className="svg_icons" color="success" />
        </NavLink>
      </li>
      {authContext.isLoggedIn && (
        <li>
          <NavLink to="/1/places" exact>
            <ShareLocationIcon className="svg_icons" color="success" />
          </NavLink>
        </li>
      )}
      {authContext.isLoggedIn && (
        <li>
          <NavLink to="/places/new" exact>
            <AddLocationAltIcon className="svg_icons" color="success" />
          </NavLink>
        </li>
      )}
      {authContext.isLoggedIn ? (
        <li>
          <NavLink to="/auth">
            <LogoutIcon className="svg_icons" color="success" onClick={authContext.logout}/>
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink to="/auth">
            <LoginIcon className="svg_icons" color="success" />
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
