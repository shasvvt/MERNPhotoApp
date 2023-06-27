import React, { useEffect, useState, useCallback } from 'react'
import UsersList from '../components/UsersList'

const Users = () => {

  const [userData, setUserData] = useState([]);

 

  const fetchUsersData = useCallback(async () => {
    const dummyData = await fetch('https://dummyjson.com/users')
    const dummyResponse = await dummyData.json();
    console.log(dummyResponse)
    setUserData(dummyResponse.users)
  }, []);

  useEffect(()=> {
    fetchUsersData()
  }, [fetchUsersData])

  return (
    <div style={{display:'flex', justifyContent:'center'}}>
    <UsersList items={userData}/>
    </div>
  )
}

export default Users