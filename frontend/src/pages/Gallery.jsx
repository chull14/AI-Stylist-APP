import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button
} from '@mui/material'
import { Favorite, Share } from '@mui/icons-material'

const Gallery = () => {
  const galleries = [
    {
      id: 1,
      title: 'Summer Street Style',
      description: 'Casual and chic summer looks',
      image: 'https://via.placeholder.com/400x500/ff6b6b/ffffff?text=Summer+Style',
      tags: ['Summer', 'Casual', 'Street Style']
    },
    {
      id: 2,
      title: 'Evening Elegance',
      description: 'Sophisticated evening wear',
      image: 'https://via.placeholder.com/400x500/4ecdc4/ffffff?text=Evening+Elegance',
      tags: ['Evening', 'Elegant', 'Formal']
    },
    {
      id: 3,
      title: 'Minimalist Chic',
      description: 'Clean and minimal fashion',
      image: 'https://via.placeholder.com/400x500/45b7d1/ffffff?text=Minimalist',
      tags: ['Minimalist', 'Clean', 'Modern']
    },
    {
      id: 4,
      title: 'Boho Vibes',
      description: 'Bohemian and free-spirited looks',
      image: 'https://via.placeholder.com/400x500/96ceb4/ffffff?text=Boho',
      tags: ['Bohemian', 'Free-spirited', 'Natural']
    }
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Inspiration Gallery
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Discover curated fashion looks and trends to inspire your personal style.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {galleries.map((gallery) => (
          <Grid item xs={12} sm={6} md={4} key={gallery.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="300"
                image={gallery.image}
                alt={gallery.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {gallery.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {gallery.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {gallery.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button size="small" startIcon={<Favorite />}>
                    Save
                  </Button>
                  <Button size="small" startIcon={<Share />}>
                    Share
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

export default Gallery 