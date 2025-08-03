import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material'
import { AutoAwesome, Refresh, Favorite } from '@mui/icons-material'

const Looks = () => {
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedOccasion, setSelectedOccasion] = useState('')

  const looks = [
    {
      id: 1,
      title: 'Casual Weekend Look',
      description: 'Perfect for brunch or shopping',
      image: 'https://via.placeholder.com/400x500/ff9ff3/ffffff?text=Weekend+Look',
      style: 'Casual',
      occasion: 'Weekend',
      items: ['Denim Jacket', 'White T-Shirt', 'Black Jeans', 'Sneakers']
    },
    {
      id: 2,
      title: 'Office Professional',
      description: 'Smart and sophisticated for work',
      image: 'https://via.placeholder.com/400x500/54a0ff/ffffff?text=Office+Look',
      style: 'Professional',
      occasion: 'Work',
      items: ['Blazer', 'Blouse', 'Pencil Skirt', 'Heels']
    },
    {
      id: 3,
      title: 'Evening Out',
      description: 'Elegant for dinner or events',
      image: 'https://via.placeholder.com/400x500/5f27cd/ffffff?text=Evening+Look',
      style: 'Elegant',
      occasion: 'Evening',
      items: ['Cocktail Dress', 'Statement Jewelry', 'Clutch', 'Heels']
    }
  ]

  const styles = ['Casual', 'Professional', 'Elegant', 'Bohemian', 'Minimalist']
  const occasions = ['Weekend', 'Work', 'Evening', 'Sport', 'Formal']

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI Generated Looks
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Discover personalized outfit combinations based on your closet and preferences.
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Style</InputLabel>
                <Select
                  value={selectedStyle}
                  label="Style"
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  <MenuItem value="">All Styles</MenuItem>
                  {styles.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Occasion</InputLabel>
                <Select
                  value={selectedOccasion}
                  label="Occasion"
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                >
                  <MenuItem value="">All Occasions</MenuItem>
                  {occasions.map((occasion) => (
                    <MenuItem key={occasion} value={occasion}>
                      {occasion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                startIcon={<AutoAwesome />}
                fullWidth
              >
                Generate New Look
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {looks.map((look) => (
          <Grid item xs={12} sm={6} md={4} key={look.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="300"
                image={look.image}
                alt={look.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {look.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {look.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={look.style} size="small" color="primary" />
                  <Chip label={look.occasion} size="small" color="secondary" />
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Items needed:</strong>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {look.items.map((item) => (
                    <Chip key={item} label={item} size="small" variant="outlined" />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size="small" startIcon={<Favorite />}>
                    Save Look
                  </Button>
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Looks 