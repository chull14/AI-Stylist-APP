import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Closet from './pages/Closet'
import Gallery from './pages/Gallery'
import Looks from './pages/Looks'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="closet" element={<Closet />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="looks" element={<Looks />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App 