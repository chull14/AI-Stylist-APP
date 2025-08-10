import React, { useState, useEffect } from 'react'
import { userAPI, closetAPI, looksAPI } from '../services/api'
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Snackbar,
  Chip
} from '@mui/material'
import {
  Person,
  Email,
  CalendarToday,
  Edit,
  Save,
  Cancel,
  Refresh,
  Delete
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [stats, setStats] = useState({
    closetItems: 0,
    savedLooks: 0,
    galleries: 0
  })
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: 'Fashion enthusiast and style explorer'
  })

  // Load user profile and statistics
  const loadProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load user profile
      const profileResponse = await userAPI.getUserProfile()
      if (profileResponse.data && profileResponse.data.user) {
        const userData = profileResponse.data.user
        setProfileData({
          username: userData.username || user?.username || '',
          email: userData.email || user?.email || '',
          bio: userData.bio || 'Fashion enthusiast and style explorer'
        })
      }
      
      // Load statistics
      const [closetResponse, looksResponse] = await Promise.all([
        closetAPI.getCloset().catch(() => ({ data: { closet: [] } })),
        looksAPI.getAllLooks().catch(() => ({ data: { looks: [] } }))
      ])
      
      setStats({
        closetItems: closetResponse.data?.closet?.length || 0,
        savedLooks: looksResponse.data?.looks?.length || 0,
        galleries: 0 // TODO: Add gallery count when gallery API is available
      })
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await userAPI.updateUserProfile(profileData)
      
      if (response.data) {
        setSuccessMessage('Profile updated successfully!')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      bio: 'Fashion enthusiast and style explorer'
    })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true)
        setError(null)
        
        await userAPI.deleteUser()
        setSuccessMessage('Account deleted successfully. You will be logged out.')
        
        // Logout after a short delay
        setTimeout(() => {
          logout()
        }, 2000)
      } catch (error) {
        console.error('Error deleting account:', error)
        setError('Failed to delete account. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Button
          startIcon={<Refresh />}
          onClick={loadProfile}
          disabled={loading}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Personal Information
              </Typography>
              {!isEditing ? (
                <Button startIcon={<Edit />} onClick={handleEdit} disabled={loading}>
                  Edit Profile
                </Button>
              ) : (
                <Box>
                  <Button startIcon={<Save />} onClick={handleSave} sx={{ mr: 1 }} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button startIcon={<Cancel />} onClick={handleCancel} color="error" disabled={loading}>
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={3}
                  value={profileData.bio}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  placeholder="Tell us about your fashion style and preferences..."
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Avatar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main'
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {user?.username}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Member since {new Date().getFullYear()}
            </Typography>
            
            {/* User Role */}
            {user?.roles && (
              <Box sx={{ mb: 2 }}>
                {user.roles.map((role) => (
                  <Chip 
                    key={role} 
                    label={role} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mr: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Account Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Statistics
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText
                  primary="Closet Items"
                  secondary={`${stats.closetItems} items in your closet`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText
                  primary="Saved Looks"
                  secondary={`${stats.savedLooks} AI-generated looks saved`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CalendarToday />
                </ListItemIcon>
                <ListItemText
                  primary="Galleries Created"
                  secondary={`${stats.galleries} inspiration galleries`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, border: '1px solid #ff6b6b' }}>
            <Typography variant="h6" gutterBottom color="error">
              Danger Zone
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              These actions cannot be undone. Please be careful.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              Delete Account
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Profile 