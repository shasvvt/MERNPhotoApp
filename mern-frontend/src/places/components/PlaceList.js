import React from "react";
import "./PlaceList.css";
import ShareIcon from "@mui/icons-material/Share";
import PlaceItem from "./PlaceItem";
import './PlaceList.css'
import Button from "../../shared/components/FormElements/Button";

const PlaceList = (props) => {

    console.log(props)

  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <h2>No places found. Maybe add one?</h2><br/>
        <Button to="/places/new">Share Place</Button>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          addess={place.address}
          createrId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
