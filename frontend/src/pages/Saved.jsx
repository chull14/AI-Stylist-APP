import React, { useState, useEffect } from 'react'
import { galleryAPI, looksAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
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
  Stack,
  Alert,
  CircularProgress,
  Snackbar
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
  AutoAwesome,
  Refresh
} from '@mui/icons-material'

const Saved = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openAICreateDialog, setOpenAICreateDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [savedLooks, setSavedLooks] = useState([])
  const [savedGalleries, setSavedGalleries] = useState([])
  
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Load saved looks from backend
  const loadSavedLooks = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading saved looks...')
      const response = await looksAPI.getSavedLooks()
      
      console.log('Saved looks response:', response.data)
      
      if (response.data && response.data.looks) {
        const transformedLooks = response.data.looks.map(look => ({
          id: look._id,
          title: look.title,
          description: look.description,
          image: look.image || (look.imagePath ? `http://localhost:8000/uploads/${look.imagePath.split('/').pop()}` : 'https://via.placeholder.com/400x500/ff9ff3/ffffff?text=Look'),
          style: look.style,
          occasion: look.occasion,
          aesthetic: look.aesthetic || [],
          tags: look.tags || [],
          notes: look.notes,
          sourceType: look.sourceType || 'Uploaded',
          isLiked: look.isLiked,
          isSaved: look.isSaved,
          createdAt: look.createdAt,
          updatedAt: look.updatedAt
        }))
        console.log('Transformed saved looks:', transformedLooks)
        setSavedLooks(transformedLooks)
      } else {
        console.log('No saved looks found')
        setSavedLooks([])
      }
    } catch (error) {
      console.error('Error loading saved looks:', error)
      setError('Failed to load saved looks. Please try again.')
      setSavedLooks([])
    } finally {
      setLoading(false)
    }
  }

  // Load saved galleries from backend
  const loadSavedGalleries = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await galleryAPI.getAllGalleries()
      
      if (response.data && response.data.galleries) {
        // Filter for saved galleries (you might want to add a savedBy field to galleries)
        const transformedGalleries = response.data.galleries.map(gallery => ({
          id: gallery._id,
          title: gallery.title,
          description: gallery.description,
          coverImage: gallery.coverImage || 'https://via.placeholder.com/400x600/4ecdc4/ffffff?text=Gallery',
          imageCount: gallery.looksCount || 0,
          followers: gallery.followers || 0,
          author: user?.username || 'You',
          authorAvatar: user?.avatar || `https://via.placeholder.com/40x40/4ecdc4/ffffff?text=${user?.username?.charAt(0) || 'U'}`,
          tags: gallery.tags || ['Fashion'],
          isSaved: true, // Since this is the saved page
          isLiked: false,
          createdAt: gallery.createdAt,
          updatedAt: gallery.updatedAt
        }))
        setSavedGalleries(transformedGalleries)
      } else {
        setSavedGalleries([])
      }
    } catch (error) {
      console.error('Error loading saved galleries:', error)
      setError('Failed to load saved galleries. Please try again.')
      setSavedGalleries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 0) {
      loadSavedLooks()
    } else {
      loadSavedGalleries()
    }
  }, [activeTab])

  const handleLikeLook = async (lookId) => {
    try {
      console.log('Saving/unsaving look with ID:', lookId)
      const response = await looksAPI.toggleLikeLook(lookId)
      
      if (response.data) {
        console.log('Save response:', response.data)
        // Update the look in the list with the new save status
        setSavedLooks(prev => prev.map(look => 
          look.id === lookId 
            ? { ...look, isLiked: response.data.isLiked, isSaved: response.data.isSaved }
            : look
        ))
        
        // If the look was unsaved, remove it from the list
        if (!response.data.isSaved) {
          setSavedLooks(prev => prev.filter(look => look.id !== lookId))
        }
        
        setSuccessMessage(response.data.message)
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      setError('Failed to update save status. Please try again.')
    }
  }



  const handleShareLook = (look) => {
    if (navigator.share) {
      navigator.share({
        title: look.title,
        text: look.description,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${look.title}: ${look.description}`)
      setSuccessMessage('Look link copied to clipboard!')
    }
  }

  const handleDeleteLook = async (lookId) => {
    if (window.confirm('Are you sure you want to delete this look?')) {
      try {
        setLoading(true)
        await looksAPI.deleteLook(lookId)
        setSuccessMessage('Look deleted successfully!')
        // Remove from saved looks list
        setSavedLooks(prev => prev.filter(look => look.id !== lookId))
      } catch (error) {
        console.error('Error deleting look:', error)
        setError('Failed to delete look. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Saved Items
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={activeTab === 0 ? loadSavedLooks : loadSavedGalleries}
            disabled={loading}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
        <Typography variant="body1" color="textSecondary">
          Your saved looks and galleries for easy access.
        </Typography>
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
          
          {!loading && savedLooks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No saved looks yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Save runway looks from the Explore page to see them here
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/explore'}
              >
                Explore Looks
              </Button>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 2
            }}>
              {savedLooks.map((look) => (
              <Box
                key={look.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
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
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShareLook(look)
                        }}
                      >
                        <Share />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteLook(look.id)
                        }}
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
                        bgcolor: 'rgba(128,128,128,0.8)',
                        '&:hover': { bgcolor: 'rgba(128,128,128,0.9)' }
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLikeLook(look.id)
                      }}
                    >
                      {look.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>

                  <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {look.title}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
                      {look.sourceType}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {look.description || look.notes || 'No description available'}
                    </Typography>

                    {/* Aesthetic Info */}
                    {look.aesthetic && look.aesthetic.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip label={look.aesthetic[0]} size="small" color="secondary" />
                        {look.aesthetic.length > 1 && (
                          <Chip label={`+${look.aesthetic.length - 1} more`} size="small" variant="outlined" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    )}

                    {/* Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {look.createdAt ? `Saved ${new Date(look.createdAt).toLocaleDateString()}` : 'Recently saved'}
                      </Typography>
                    </Box>

                    {/* Tags */}
                    {look.tags && look.tags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {look.tags.slice(0, 3).map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                        {look.tags.length > 3 && (
                          <Chip label={`+${look.tags.length - 3}`} size="small" variant="outlined" />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            ))}
            </Box>
          )}
        </Box>
      )}

      {/* Saved Galleries Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Saved Galleries
          </Typography>
          
          {!loading && savedGalleries.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No saved galleries yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create galleries using saved looks or AI assistant
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/gallery'}
              >
                Create Gallery
              </Button>
            </Box>
          ) : (
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
                        {gallery.createdAt ? `Created ${new Date(gallery.createdAt).toLocaleDateString()}` : 'Recently created'}
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
          )}
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
            label="Tags (comma separated)"
            fullWidth
            variant="outlined"
            placeholder="Summer, Casual, Street Style"
            value={newGallery.tags.join(', ')}
            onChange={(e) => setNewGallery({...newGallery, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={async () => {
              try {
                setLoading(true)
                setError(null)
                
                const response = await galleryAPI.createGallery(newGallery)
                
                if (response.data) {
                  setSuccessMessage('Gallery created successfully!')
                  setOpenCreateDialog(false)
                  setNewGallery({title: '', description: '', coverImage: '', tags: []})
                  loadSavedGalleries() // Refresh the list
                }
              } catch (error) {
                console.error('Error creating gallery:', error)
                setError('Failed to create gallery. Please try again.')
              } finally {
                setLoading(false)
              }
            }} 
            variant="contained"
            disabled={!newGallery.title || !newGallery.description || loading}
          >
            {loading ? 'Creating...' : 'Create Gallery'}
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
              label="Gallery Title (Optional)"
              fullWidth
              variant="outlined"
              placeholder="AI will suggest a title based on your preferences"
              value={aiGalleryParams.title || ''}
              onChange={(e) => setAIGalleryParams({...aiGalleryParams, title: e.target.value})}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAICreateDialog(false)} disabled={loading}>Cancel</Button>
          <Button 
            onClick={async () => {
              try {
                setLoading(true)
                setError(null)
                
                const galleryData = {
                  title: aiGalleryParams.title || `AI ${aiGalleryParams.aesthetic} Gallery`,
                  description: `AI-generated gallery with ${aiGalleryParams.aesthetic} aesthetic, ${aiGalleryParams.colors} colors, ${aiGalleryParams.season} season`,
                  tags: [aiGalleryParams.aesthetic, aiGalleryParams.colors, aiGalleryParams.season, aiGalleryParams.style, aiGalleryParams.occasion].filter(Boolean)
                }
                
                const response = await galleryAPI.createGallery(galleryData)
                
                if (response.data) {
                  setSuccessMessage('AI Gallery created successfully!')
                  setOpenAICreateDialog(false)
                  setAIGalleryParams({aesthetic: '', colors: '', season: '', style: '', occasion: '', title: ''})
                  loadSavedGalleries() // Refresh the list
                }
              } catch (error) {
                console.error('Error creating AI gallery:', error)
                setError('Failed to create AI gallery. Please try again.')
              } finally {
                setLoading(false)
              }
            }} 
            variant="contained"
            color="secondary"
            disabled={!aiGalleryParams.aesthetic || !aiGalleryParams.colors || !aiGalleryParams.season || loading}
          >
            {loading ? 'Generating...' : 'Generate AI Gallery'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Saved 