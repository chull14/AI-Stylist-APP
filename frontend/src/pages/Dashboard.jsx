import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Avatar
} from '@mui/material'
import {
  Checkroom,
  PhotoLibrary,
  Style,
  Add,
  TrendingUp
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    {
      title: 'Closet Items',
      value: '12',
      icon: <Checkroom />,
      color: '#1976d2',
      action: () => navigate('/closet')
    },
    {
      title: 'Inspiration Galleries',
      value: '3',
      icon: <PhotoLibrary />,
      color: '#dc004e',
      action: () => navigate('/gallery')
    },
    {
      title: 'AI Generated Looks',
      value: '8',
      icon: <Style />,
      color: '#2e7d32',
      action: () => navigate('/looks')
    }
  ]

  const quickActions = [
    {
      title: 'Add to Closet',
      description: 'Upload a new clothing item',
      icon: <Add />,
      action: () => navigate('/closet')
    },
    {
      title: 'Get AI Styling',
      description: 'Generate outfit suggestions',
      icon: <Style />,
      action: () => navigate('/looks')
    },
    {
      title: 'Browse Inspiration',
      description: 'Explore fashion trends',
      icon: <TrendingUp />,
      action: () => navigate('/gallery')
    }
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.username}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Ready to discover your perfect style? Let's get started.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
              }}
              onClick={stat.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h4" component="div">
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="h6" component="div">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                cursor: 'pointer',
                '&:hover': { 
                  transform: 'translateY(-2px)', 
                  transition: 'transform 0.2s',
                  boxShadow: 3
                }
              }}
              onClick={action.action}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {action.icon}
                </Avatar>
                <Typography variant="h6">
                  {action.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                {action.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="textSecondary">
            No recent activity. Start by adding items to your closet or exploring inspiration galleries!
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}

export default Dashboard 