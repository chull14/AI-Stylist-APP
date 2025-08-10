import axios from 'axios'

// Base API configuration
export const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true
})

// Separate client without interceptors for refresh calls to avoid loops
const refreshClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true
})

// Add request interceptor to include auth token
api.interceptors.request.use(
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

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If no response (network error), just bubble up
    if (!error.response) {
      return Promise.reject(error)
    }

    const status = error.response.status
    const isRefreshRequest = originalRequest?.url?.includes('/api/refresh')

    // If the refresh request itself failed or we're already retried, clear and redirect
    if (isRefreshRequest || originalRequest?._retry) {
      if (status === 401 || status === 403) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    // Handle 401 by attempting a single refresh using the bare client (no interceptors)
    if (status === 401) {
      originalRequest._retry = true
      try {
        const resp = await refreshClient.get('/api/refresh')
        const { accessToken } = resp.data || {}
        if (!accessToken) {
          throw new Error('No accessToken in refresh response')
        }
        localStorage.setItem('accessToken', accessToken)
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Helper function to get user ID
const getUserId = () => {
  return localStorage.getItem('userId')
}

// Gallery API functions
export const galleryAPI = {
  // Get all user galleries
  getAllGalleries: () => {
    const userId = getUserId()
    return api.get(`/api/users/${userId}/galleries`)
  },

  // Create a new gallery
  createGallery: (galleryData) => {
    const userId = getUserId()
    return api.post(`/api/users/${userId}/galleries`, galleryData)
  },

  // Get a specific gallery
  getGallery: (galleryId) => {
    const userId = getUserId()
    return api.get(`/api/users/${userId}/galleries/${galleryId}`)
  },

  // Update a gallery
  updateGallery: (galleryId, galleryData) => {
    const userId = getUserId()
    return api.put(`/api/users/${userId}/galleries/${galleryId}`, galleryData)
  },

  // Delete a gallery
  deleteGallery: (galleryId) => {
    const userId = getUserId()
    return api.delete(`/api/users/${userId}/galleries/${galleryId}`)
  }
}

// Looks API functions
export const looksAPI = {
  // Get all user looks
  getAllLooks: () => {
    const userId = getUserId()
    return api.get(`/api/users/${userId}/looks`)
  },

  // Get user's saved looks
  getSavedLooks: () => {
    const userId = getUserId()
    console.log('API: getSavedLooks called with userId:', userId)
    const url = `/api/users/${userId}/looks/saved`
    console.log('API: Making request to:', url)
    return api.get(url)
  },

  // Create a single look
  createLook: (lookData) => {
    const userId = getUserId()
    const formData = new FormData()
    
    // Add image file if provided
    if (lookData.image) {
      formData.append('image', lookData.image)
    }
    
    // Add other data
    Object.keys(lookData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, lookData[key])
      }
    })
    
    return api.post(`/api/users/${userId}/looks`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Create multiple looks
  createMultipleLooks: (looksData) => {
    const userId = getUserId()
    const formData = new FormData()
    
    // Add image files
    if (looksData.images) {
      looksData.images.forEach(image => {
        formData.append('images', image)
      })
    }
    
    // Add other data
    Object.keys(looksData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, looksData[key])
      }
    })
    
    return api.post(`/api/users/${userId}/looks/batch`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Get a specific look
  getLook: (lookId) => {
    const userId = getUserId()
    return api.get(`/api/users/${userId}/looks/${lookId}`)
  },

  // Update a look
  updateLook: (lookId, lookData) => {
    const userId = getUserId()
    return api.put(`/api/users/${userId}/looks/${lookId}`, lookData)
  },

  // Delete a look
  deleteLook: (lookId) => {
    const userId = getUserId()
    return api.delete(`/api/users/${userId}/looks/${lookId}`)
  },

  // Like or unlike a look (now also handles saving)
  toggleLikeLook: (lookId) => {
    const userId = getUserId()
    console.log('API: toggleLikeLook called with lookId:', lookId, 'userId:', userId)
    const url = `/api/users/${userId}/looks/${lookId}/like`
    console.log('API: Making request to:', url)
    return api.patch(url)
  },

  // Add a look to a gallery
  addLookToGallery: (lookId, galleryId) => {
    const userId = getUserId()
    return api.patch(`/api/users/${userId}/looks/${lookId}/galleries/${galleryId}`)
  }
}

// Closet API functions
export const closetAPI = {
  // Get user's closet
  getCloset: () => {
    const userId = getUserId()
    return api.get(`/api/users/${userId}/closet`)
  },

  // Upload item to closet
  uploadItem: (itemData) => {
    const userId = getUserId()
    const formData = new FormData()
    
    // Add image file if provided
    if (itemData.image) {
      formData.append('image', itemData.image)
    }
    
    // Add other data
    Object.keys(itemData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, itemData[key])
      }
    })
    
    return api.post(`/api/users/${userId}/closet`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Get a specific closet item
  getClosetItem: (closetId) => {
    const userId = getUserId()
    return api.get(`/api/users/${userId}/closet/${closetId}`)
  },

  // Update a closet item
  updateClosetItem: (closetId, itemData) => {
    const userId = getUserId()
    return api.put(`/api/users/${userId}/closet/${closetId}`, itemData)
  },

  // Delete a closet item
  deleteClosetItem: (closetId) => {
    const userId = getUserId()
    return api.delete(`/api/users/${userId}/closet/${closetId}`)
  }
}

// User API functions
export const userAPI = {
  // Get user profile
  getUserProfile: () => {
    const userId = getUserId()
    return api.get(`/api/users/${userId}`)
  },

  // Update user profile
  updateUserProfile: (userData) => {
    const userId = getUserId()
    return api.put(`/api/users/${userId}`, userData)
  },

  // Delete user account
  deleteUser: () => {
    const userId = getUserId()
    return api.delete(`/api/users/${userId}`)
  }
} 