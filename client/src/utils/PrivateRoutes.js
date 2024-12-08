import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'

const PrivateRoutes = () => {
    const { userID, loading  } = useUserContext()

    if (loading) return <div>Loading...</div>

    return userID ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoutes