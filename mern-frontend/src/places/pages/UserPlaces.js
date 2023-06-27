import React from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: 1,
    title: "Marine Drive - Patna",
    imageUrl:
      "https://gumlet.assettype.com/swarajya%2F2022-06%2Fd086ebcd-bd3b-4659-85dc-f5edb68e5ea5%2FFWBQbv9WYAAF2Xr.jpg",
    description: "Infamouse marine drive of Patna",
    address: "Patna, Bihar",
    creator: "Shaswat",
    location: {
      lat: 25.6197898,
      lng: 85.1797413,
    },
  },
  {
    id: 2,
    title: "India Gate - Patna",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/90/Sabhyata_Dwar_%2Cpatna.jpg",
    description: "India Gate of Patna",
    address: "Patna, Bihar",
    creator: "Shaswat1",
    location: {
      lat: 25.6219088,
      lng: 85.1417289,
    },
  },
];

export const UserPlaces = (props) => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.id == userId);
  return <PlaceList items={loadedPlaces} />;
};
