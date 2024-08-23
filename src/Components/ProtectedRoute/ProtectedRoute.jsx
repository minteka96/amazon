import React, { useContext, useEffect } from 'react'
import { DataContext } from '../DataProvider/DataProvider'
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({children,redirect,msg}) {
  const [{user},dispatch] = useContext(DataContext)
  const navigate=useNavigate()
  useEffect(() => {
    if(!user){
      navigate("/auth",{state:{msg,redirect}})
    }
  }, [user]);
  return children;
}
export default ProtectedRoute