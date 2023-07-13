import React from "react";
import UserItem from "./UserItem";
import "./UsersList.css";
import CircularProgress from '@mui/material/CircularProgress';

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center" style={{margin: '20px'}}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <ul style={{listStyle:'none'}}>
      {props.items.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
