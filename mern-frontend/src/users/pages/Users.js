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
  }, []);

  const fetchUsersData = async () => {
    try {
      const userData = await sendRequest("http://localhost:5001/api/users");
      // const responseData = await response.json();
      // if (!response.ok) {
      //   throw new Error(response.message);
      // }
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
