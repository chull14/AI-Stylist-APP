import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

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

  // Set up axios defaults
  axios.defaults.baseURL = 'http://localhost:8000'
  axios.defaults.withCredentials = true

  // Add request interceptor to include auth token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(requestInterceptor)
    }
  }, [])

  // Add response interceptor to handle token refresh
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        // Update last activity on successful requests
        setLastActivity(Date.now())
        return response
      },
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const response = await axios.get('/api/refresh')
            const { accessToken } = response.data
            localStorage.setItem('accessToken', accessToken)
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            setLastActivity(Date.now()) // Update activity on successful refresh
            return axios(originalRequest)
          } catch (refreshError) {
            logout()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  const login = async (username, password) => {
    try {
      setError(null)
      const response = await axios.post('/api/login', { username, pwd: password })
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
      const response = await axios.post('/api/register', { 
        username, 
        email, 
        pwd: password 
      })
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
      await axios.get('/api/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userId')
      setUser(null)
    }
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setLoading(false)
        return
      }

      // Try to refresh token to check if it's valid
      const response = await axios.get('/api/refresh')
      const { accessToken, user } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      setUser(user)
    } catch (error) {
      console.log('Auth check failed:', error)
      // Only clear token if it's an auth error, not network error
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
        setUser(null)
      } else {
        // For network errors, keep the user logged in if we have a token
        const token = localStorage.getItem('accessToken')
        if (token) {
          // Try to decode the token to get user info
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            const userData = {
              id: payload.UserInfo.id,
              username: payload.UserInfo.username,
              roles: payload.UserInfo.roles
            }
            setUser(userData)
            localStorage.setItem('userId', userData.id) // Ensure user ID is stored
          } catch (e) {
            console.log('Could not decode token:', e)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('userId')
            setUser(null)
          }
        }
      }
    } finally {
      setLoading(false)
    }
  }

  // Auto-logout functionality
  useEffect(() => {
    if (!user) return

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
      clearInterval(interval)
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