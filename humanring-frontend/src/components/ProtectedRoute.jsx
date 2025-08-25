import React from 'react'
import { Spin } from 'antd'
import { Navigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'


const ProtectedRoute = ({children}) => {
  const { isAuthenticated, isLoading } = useAuth0()
  
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace />
    )
  }

  return children
}

export default ProtectedRoute
