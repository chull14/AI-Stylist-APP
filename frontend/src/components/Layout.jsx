import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material'
import {
  Person,
  Logout,
  PhotoLibrary,
  Bookmark,
  Checkroom,
  Style
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { text: 'Explore', icon: <PhotoLibrary />, path: '/explore' },
  { text: 'Saved', icon: <Bookmark />, path: '/saved' },
  { text: 'My Closet', icon: <Checkroom />, path: '/closet' },
  { text: 'Stylist', icon: <Style />, path: '/looks' },
  { text: 'Profile', icon: <Person />, path: '/profile' }
]

const Layout = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    handleMenuClose()
  }

  const handleTabChange = (event, newValue) => {
    const selectedItem = menuItems[newValue]
    navigate(selectedItem.path)
  }

  const getCurrentTabIndex = () => {
    return menuItems.findIndex(item => item.path === location.pathname)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar sx={{ position: 'relative' }}>
          <Typography variant="h6" noWrap component="div" sx={{ position: 'absolute', left: 16, zIndex: 1 }}>
            AI Stylist
          </Typography>
          
          <Tabs 
            value={getCurrentTabIndex()} 
            onChange={handleTabChange}
            sx={{ 
              width: '100%',
              '& .MuiTabs-flexContainer': {
                justifyContent: 'center',
                gap: 8,
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ffffff',
              },
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                minWidth: 'auto',
                padding: '20px 32px',
                minHeight: '80px',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: '#ffffff',
                },
              },
            }}
          >
            {menuItems.map((item, index) => (
              <Tab 
                key={item.text} 
                label={item.text}
              />
            ))}
          </Tabs>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
            sx={{ position: 'absolute', right: 16, zIndex: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
              <Person sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout 