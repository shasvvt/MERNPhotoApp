import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";

export const UserPlaces = (props) => {
  const userId = useParams().userId;

  const [loadedPlaces, setLoadedPlaces] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const getPlaces = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5001/api/places/user/${userId}`
      );
      setLoadedPlaces(responseData.places);
    } catch (err) {}
  };

  const deletePlace = async (placeId) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/places/${placeId}`,
        "DELETE"
      );
      console.log("Place deleted successfully.");
    } catch (error) {}

    setLoadedPlaces((prevPlaces) => prevPlaces.filter(place => place.id !==placeId));
  };

  useEffect(() => {
    getPlaces();
  }, [sendRequest, userId]);

  const likePlace = async(placeId) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/places/${placeId}/like`,
        "PATCH",
        JSON.stringify({
          creator: userId
        }),
        {"Content-Type": "application/json"}
      )
    } catch (error) {
      
    }
  }

  const commentPlace = async (text, placeId) => {
    try {
      await sendRequest(
        `http://localhost:5001/api/places/${placeId}/comments`,
        'PATCH',
        JSON.stringify({
          text: text,
          creator: userId
        }),
        {"Content-Type": "application/json"}
      )
    } catch (error) {
      
    }
  }

  return (
    <div>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {loadedPlaces && (
        <PlaceList items={loadedPlaces} onDelete={deletePlace} onLike={likePlace} onComment={commentPlace}/>
      )}
    </div>
  );
};
