import React, { useState, useEffect } from 'react'
import { galleryAPI } from '../services/api'
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Grid,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Share,
  MoreVert,
  Delete,
  Edit,
  Add,
  AutoAwesome
} from '@mui/icons-material'

const Saved = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openAICreateDialog, setOpenAICreateDialog] = useState(false)
  const [newGallery, setNewGallery] = useState({
    title: '',
    description: '',
    coverImage: '',
    tags: []
  })
  const [aiGalleryParams, setAIGalleryParams] = useState({
    aesthetic: '',
    colors: '',
    season: '',
    style: '',
    occasion: ''
  })
  const [loading, setLoading] = useState(false)

  const savedLooks = []
  const savedGalleries = []

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Load saved galleries from backend
  useEffect(() => {
    const loadSavedGalleries = async () => {
      try {
        setLoading(true)
        const response = await galleryAPI.getAllGalleries()
        // TODO: Replace with actual backend data
        console.log('Loaded saved galleries:', response.data)
      } catch (error) {
        console.error('Error loading saved galleries:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSavedGalleries()
  }, [])

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Saved Items
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Your saved looks and galleries for easy access.
        </Typography>
      </Box>

      {/* Tabs and Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={`Saved Looks (${savedLooks.length})`} />
          <Tab label={`Saved Galleries (${savedGalleries.length})`} />
        </Tabs>
        
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateDialog(true)}
            >
              Create Gallery
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AutoAwesome />}
              onClick={() => setOpenAICreateDialog(true)}
            >
              AI Create Gallery
            </Button>
          </Box>
        )}
      </Box>

      {/* Saved Looks Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Saved Runway Looks
          </Typography>
          
          <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3, lg: 4 }, columnGap: 2 }}>
            {savedLooks.map((look) => (
              <Box
                key={look.id}
                sx={{
                  breakInside: 'avoid',
                  mb: 2,
                  display: 'inline-block',
                  width: '100%'
                }}
              >
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s ease-in-out',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={look.image}
                      alt={look.title}
                      sx={{ height: 'auto', width: '100%' }}
                    />
                    
                    {/* Overlay Actions */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
                      >
                        <Bookmark color="primary" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
                      >
                        <Share />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>

                    {/* Like Button */}
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' }
                      }}
                    >
                      <Favorite color="error" />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {look.title}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
                      {look.designer}
                    </Typography>

                    {/* Season Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip label={look.season} size="small" color="secondary" />
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {look.likes.toLocaleString()} likes
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Saved {look.savedDate}
                      </Typography>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {look.tags.slice(0, 3).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                      {look.tags.length > 3 && (
                        <Chip label={`+${look.tags.length - 3}`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Saved Galleries Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Saved Galleries
          </Typography>
          
          <Grid container spacing={3}>
            {savedGalleries.map((gallery) => (
              <Grid item xs={12} sm={6} md={4} key={gallery.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s ease-in-out',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={gallery.coverImage}
                      alt={gallery.title}
                      sx={{ height: 200 }}
                    />
                    
                    {/* Overlay Actions */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
                      >
                        <Bookmark color="primary" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {gallery.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {gallery.description}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {gallery.imageCount} pins
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Created {gallery.createdDate}
                      </Typography>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {gallery.tags.slice(0, 3).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                      {gallery.tags.length > 3 && (
                        <Chip label={`+${gallery.tags.length - 3}`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Create Gallery Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Gallery</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Gallery Title"
            fullWidth
            variant="outlined"
            value={newGallery.title}
            onChange={(e) => setNewGallery({...newGallery, title: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newGallery.description}
            onChange={(e) => setNewGallery({...newGallery, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Cover Image URL"
            fullWidth
            variant="outlined"
            value={newGallery.coverImage}
            onChange={(e) => setNewGallery({...newGallery, coverImage: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Tags (comma separated)"
            fullWidth
            variant="outlined"
            placeholder="Summer, Casual, Street Style"
            value={newGallery.tags.join(', ')}
            onChange={(e) => setNewGallery({...newGallery, tags: e.target.value.split(',').map(tag => tag.trim())})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              // TODO: Save gallery to backend
              console.log('Creating gallery:', newGallery)
              setOpenCreateDialog(false)
              setNewGallery({title: '', description: '', coverImage: '', tags: []})
            }} 
            variant="contained"
            disabled={!newGallery.title || !newGallery.description}
          >
            Create Gallery
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Create Gallery Dialog */}
      <Dialog open={openAICreateDialog} onClose={() => setOpenAICreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>AI Create Gallery</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Let AI create a personalized gallery based on your preferences. The AI will curate looks that match your specified aesthetic, colors, season, and style.
          </Typography>
          
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Aesthetic</InputLabel>
              <Select
                value={aiGalleryParams.aesthetic}
                label="Aesthetic"
                onChange={(e) => setAIGalleryParams({...aiGalleryParams, aesthetic: e.target.value})}
              >
                <MenuItem value="minimalist">Minimalist</MenuItem>
                <MenuItem value="bohemian">Bohemian</MenuItem>
                <MenuItem value="vintage">Vintage</MenuItem>
                <MenuItem value="streetwear">Streetwear</MenuItem>
                <MenuItem value="elegant">Elegant</MenuItem>
                <MenuItem value="edgy">Edgy</MenuItem>
                <MenuItem value="romantic">Romantic</MenuItem>
                <MenuItem value="sporty">Sporty</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Color Palette</InputLabel>
              <Select
                value={aiGalleryParams.colors}
                label="Color Palette"
                onChange={(e) => setAIGalleryParams({...aiGalleryParams, colors: e.target.value})}
              >
                <MenuItem value="neutral">Neutral (Beige, White, Black)</MenuItem>
                <MenuItem value="warm">Warm (Red, Orange, Yellow)</MenuItem>
                <MenuItem value="cool">Cool (Blue, Purple, Green)</MenuItem>
                <MenuItem value="pastel">Pastel</MenuItem>
                <MenuItem value="bold">Bold & Bright</MenuItem>
                <MenuItem value="monochrome">Monochrome</MenuItem>
                <MenuItem value="earth">Earth Tones</MenuItem>
                <MenuItem value="jewel">Jewel Tones</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Season</InputLabel>
              <Select
                value={aiGalleryParams.season}
                label="Season"
                onChange={(e) => setAIGalleryParams({...aiGalleryParams, season: e.target.value})}
              >
                <MenuItem value="spring">Spring</MenuItem>
                <MenuItem value="summer">Summer</MenuItem>
                <MenuItem value="fall">Fall</MenuItem>
                <MenuItem value="winter">Winter</MenuItem>
                <MenuItem value="all-season">All Season</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Style</InputLabel>
              <Select
                value={aiGalleryParams.style}
                label="Style"
                onChange={(e) => setAIGalleryParams({...aiGalleryParams, style: e.target.value})}
              >
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="street">Street Style</MenuItem>
                <MenuItem value="athleisure">Athleisure</MenuItem>
                <MenuItem value="luxury">Luxury</MenuItem>
                <MenuItem value="avant-garde">Avant-garde</MenuItem>
                <MenuItem value="classic">Classic</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Occasion</InputLabel>
              <Select
                value={aiGalleryParams.occasion}
                label="Occasion"
                onChange={(e) => setAIGalleryParams({...aiGalleryParams, occasion: e.target.value})}
              >
                <MenuItem value="everyday">Everyday</MenuItem>
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="date-night">Date Night</MenuItem>
                <MenuItem value="party">Party</MenuItem>
                <MenuItem value="travel">Travel</MenuItem>
                <MenuItem value="special-event">Special Event</MenuItem>
                <MenuItem value="weekend">Weekend</MenuItem>
                <MenuItem value="vacation">Vacation</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Gallery Title"
              fullWidth
              variant="outlined"
              placeholder="AI will suggest a title based on your preferences"
              value={aiGalleryParams.title || ''}
              onChange={(e) => setAIGalleryParams({...aiGalleryParams, title: e.target.value})}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAICreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              // TODO: Call AI service to generate gallery
              console.log('AI Gallery Params:', aiGalleryParams)
              setOpenAICreateDialog(false)
              setAIGalleryParams({aesthetic: '', colors: '', season: '', style: '', occasion: '', title: ''})
            }} 
            variant="contained"
            color="secondary"
            disabled={!aiGalleryParams.aesthetic || !aiGalleryParams.colors || !aiGalleryParams.season}
          >
            Generate AI Gallery
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Saved 