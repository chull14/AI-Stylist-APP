import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastActivity, setLastActivity] = useState(Date.now())
  
  // Auto-logout timeout (in milliseconds) - 30 minutes of inactivity
  const AUTO_LOGOUT_TIMEOUT = 30 * 60 * 1000 // 30 minutes

  const login = async (username, password) => {
    try {
      setError(null)
      const response = await api.post('/api/login', { username, pwd: password })
      const { accessToken, user } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('userId', user.id) // Store user ID for API calls
      setUser(user)
      setLastActivity(Date.now()) // Update activity on login
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      setError(message)
      return { success: false, error: message }
    }
  }

  const register = async (username, email, password) => {
    try {
      setError(null)
      const response = await api.post('/api/register', { username, email, pwd: password })
      const { accessToken, user } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('userId', user.id) // Store user ID for API calls
      setUser(user)
      setLastActivity(Date.now()) // Update activity on registration
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      setError(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await api.post('/api/logout')
    } catch (error) {
      console.log('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userId')
      setUser(null)
      setLastActivity(Date.now())
    }
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      console.log('Checking auth, token exists:', !!token)
      
      if (!token) {
        console.log('No token found, user not authenticated')
        setUser(null)
        setLoading(false)
        return
      }

      // Decode token and check expiration
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000 // Convert to seconds
        
        // Check if token is expired
        if (payload.exp && payload.exp < currentTime) {
          console.log('Token is expired, clearing tokens')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userId')
          setUser(null)
          setLoading(false)
          return
        }
        
        const userData = {
          id: payload.UserInfo.id,
          username: payload.UserInfo.username,
          roles: payload.UserInfo.roles
        }
        console.log('Using decoded token data:', userData)
        setUser(userData)
        localStorage.setItem('userId', userData.id) // Ensure user ID is stored
      } catch (e) {
        console.log('Could not decode token:', e)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
        setUser(null)
      }
    } catch (error) {
      console.log('Auth check failed:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userId')
      setUser(null)
    } finally {
      console.log('Auth check complete, loading set to false')
      setLoading(false)
    }
  }

  // Auto-logout functionality
  useEffect(() => {
    if (!user) return

    // Temporarily disable auto-logout to debug refresh issue
    /*
    const checkActivity = () => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivity
      
      if (timeSinceLastActivity > AUTO_LOGOUT_TIMEOUT) {
        console.log('Auto-logout due to inactivity')
        logout()
      }
    }

    // Check activity every minute
    const interval = setInterval(checkActivity, 60 * 1000)
    */
    
    // Track user activity (mouse movements, clicks, key presses)
    const updateActivity = () => {
      setLastActivity(Date.now())
    }

    // Add event listeners for user activity
    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('click', updateActivity)
    window.addEventListener('keypress', updateActivity)
    window.addEventListener('scroll', updateActivity)
    window.addEventListener('touchstart', updateActivity)

    return () => {
      // clearInterval(interval)
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('click', updateActivity)
      window.removeEventListener('keypress', updateActivity)
      window.removeEventListener('scroll', updateActivity)
      window.removeEventListener('touchstart', updateActivity)
    }
  }, [user, lastActivity])

  useEffect(() => {
    checkAuth()
  }, [])

  // Calculate remaining time before auto-logout
  const getRemainingTime = () => {
    if (!user) return 0
    const now = Date.now()
    const timeSinceLastActivity = now - lastActivity
    const remainingTime = AUTO_LOGOUT_TIMEOUT - timeSinceLastActivity
    return Math.max(0, remainingTime)
  }

  // Get user ID for API calls
  const getUserId = () => {
    return localStorage.getItem('userId') || user?.id
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError,
    getRemainingTime,
    getUserId,
    AUTO_LOGOUT_TIMEOUT
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}