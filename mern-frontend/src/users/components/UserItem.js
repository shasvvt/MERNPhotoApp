import React from "react";
import { Link } from "react-router-dom";
import './UserItem.css'

const UserItem = (props) => {
  return (
    <li>
      <div
        // style={{
        //   display: "flex",
        //   flexDirection: "row",
        //   flexWrap: "wrap",
        //   width: "400px",
        //   borderRadius: "5px",
        //   margin: "5px",
        //   backgroundColor: "#e4dcf5",
        // }}
        className="user-item__container"
      >
        <Link to={`/${props.id}/places`}>
          <div
            className="user-item__image"
          >
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.name}
              // style={{
              //   width: "100px",
              //   height: "100px",
              //   borderRadius: "50%",
              //   margin: "5px",
              //   backgroundColor: "#ffba9ae0",
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            ></img>
          </div>
          </Link>
          <Link to={`/${props.id}/places`}>
          <div>
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
          </Link>
      </div>
    </li>
  );
};

export default UserItem;
