import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute Component
const PrivateRoute = ({ children}) => {
    const token = localStorage.getItem('token'); // check the token exists
    return token ? children : <Navigate to={"/login"} /> // redirect if not authonticated
};

export default PrivateRoute;