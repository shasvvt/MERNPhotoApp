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

  useEffect(() => {
    getPlaces();
  }, [sendRequest, userId])

  return (
    <div>
    <ErrorModal error = {error} onClear = {clearError} />
    {isLoading && <LoadingSpinner asOverlay />}
    {loadedPlaces && <PlaceList items={loadedPlaces} />}
    </div>
  )
};
