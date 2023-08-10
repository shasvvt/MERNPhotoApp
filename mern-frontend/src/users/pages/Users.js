import React, { useEffect, useState, useCallback } from "react";
import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIComponents/LoadingSpinner";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";

import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  const [userData, setUserData] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  useEffect(() => {
    fetchUsersData();
  }, [sendRequest]);

  const fetchUsersData = async () => {
    try {
      const userData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
      setUserData(userData.users);
    } catch (err) {

    }
  };


  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {isLoading && <LoadingSpinner asOverlay />}
      {userData && <UsersList items={userData} />}
      <ErrorModal error={error} onClear={clearError}/>
    </div>
  );
};

export default Users;
