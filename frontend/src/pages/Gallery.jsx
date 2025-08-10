import React, { useState, useEffect } from 'react'
import { galleryAPI } from '../services/api'
import { galleryImages } from '../utils/fashionImages'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
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
  Share,
  Add,
  Search,
  FilterList,
  MoreVert,
  Bookmark,
  BookmarkBorder,
  AutoAwesome,
  Refresh
} from '@mui/icons-material'

const Gallery = () => {
  const { user } = useAuth()
  const [galleries, setGalleries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openAICreateDialog, setOpenAICreateDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [likedGalleries, setLikedGalleries] = useState(new Set())
  const [savedGalleries, setSavedGalleries] = useState(new Set())
  
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
    occasion: '',
    title: ''
  })

  const categories = [
    { value: 'all', label: 'All Galleries' },
    { value: 'summer', label: 'Summer Style' },
    { value: 'evening', label: 'Evening Wear' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'boho', label: 'Bohemian' },
    { value: 'workwear', label: 'Workwear' },
    { value: 'vintage', label: 'Vintage' }
  ]

  // Load galleries from backend
  const loadGalleries = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await galleryAPI.getAllGalleries()
      
      if (response.data && response.data.galleries) {
        // Transform backend data to match frontend structure
        const transformedGalleries = response.data.galleries.map(gallery => ({
          id: gallery._id,
          title: gallery.title,
          description: gallery.description,
          coverImage: gallery.coverImage || galleryImages.summerStyle, // fallback image
          imageCount: gallery.looksCount || 0,
          followers: gallery.followers || 0,
          author: user?.username || 'You',
          authorAvatar: user?.avatar || `https://via.placeholder.com/40x40/4ecdc4/ffffff?text=${user?.username?.charAt(0) || 'U'}`,
          tags: gallery.tags || ['Fashion'],
          isSaved: savedGalleries.has(gallery._id),
          isLiked: likedGalleries.has(gallery._id),
          createdAt: gallery.createdAt,
          updatedAt: gallery.updatedAt
        }))
        setGalleries(transformedGalleries)
      } else {
        setGalleries([])
      }
    } catch (error) {
      console.error('Error loading galleries:', error)
      setError('Failed to load galleries. Please try again.')
      // Fallback to sample data if API fails
      setGalleries(getSampleGalleries())
    } finally {
      setLoading(false)
    }
  }

  // Sample galleries for fallback
  const getSampleGalleries = () => [
    {
      id: 1,
      title: 'Summer Street Style',
      description: 'Casual and chic summer looks for everyday inspiration',
      coverImage: galleryImages.summerStyle,
      imageCount: 24,
      followers: 156,
      author: 'StyleInspirer',
      authorAvatar: 'https://via.placeholder.com/40x40/ff6b6b/ffffff?text=S',
      tags: ['Summer', 'Casual', 'Street Style', 'Fashion'],
      isSaved: false,
      isLiked: true
    },
    {
      id: 2,
      title: 'Evening Elegance',
      description: 'Sophisticated evening wear and formal occasions',
      coverImage: galleryImages.eveningElegance,
      imageCount: 18,
      followers: 89,
      author: 'FashionForward',
      authorAvatar: 'https://via.placeholder.com/40x40/4ecdc4/ffffff?text=F',
      tags: ['Evening', 'Elegant', 'Formal', 'Luxury'],
      isSaved: true,
      isLiked: false
    },
    {
      id: 3,
      title: 'Minimalist Chic',
      description: 'Clean and minimal fashion for the modern woman',
      coverImage: galleryImages.minimalistChic,
      imageCount: 32,
      followers: 234,
      author: 'MinimalStyle',
      authorAvatar: 'https://via.placeholder.com/40x40/45b7d1/ffffff?text=M',
      tags: ['Minimalist', 'Clean', 'Modern', 'Simple'],
      isSaved: false,
      isLiked: true
    }
  ]

  useEffect(() => {
    loadGalleries()
  }, [])

  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gallery.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gallery.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           gallery.tags.some(tag => tag.toLowerCase().includes(selectedCategory))
    
    return matchesSearch && matchesCategory
  })

  const handleCreateGallery = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const galleryData = {
        title: newGallery.title,
        description: newGallery.description,
        tags: newGallery.tags
      }
      
      const response = await galleryAPI.createGallery(galleryData)
      
      if (response.data) {
        setSuccessMessage('Gallery created successfully!')
        setOpenCreateDialog(false)
        setNewGallery({title: '', description: '', coverImage: '', tags: []})
        loadGalleries() // Refresh the list
      }
    } catch (error) {
      console.error('Error creating gallery:', error)
      setError('Failed to create gallery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAIGallery = async () => {
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
        loadGalleries() // Refresh the list
      }
    } catch (error) {
      console.error('Error creating AI gallery:', error)
      setError('Failed to create AI gallery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLikeGallery = (galleryId) => {
    setLikedGalleries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(galleryId)) {
        newSet.delete(galleryId)
      } else {
        newSet.add(galleryId)
      }
      return newSet
    })
    
    // Update the gallery in the list
    setGalleries(prev => prev.map(gallery => 
      gallery.id === galleryId 
        ? { ...gallery, isLiked: !gallery.isLiked }
        : gallery
    ))
  }

  const handleSaveGallery = (galleryId) => {
    setSavedGalleries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(galleryId)) {
        newSet.delete(galleryId)
      } else {
        newSet.add(galleryId)
      }
      return newSet
    })
    
    // Update the gallery in the list
    setGalleries(prev => prev.map(gallery => 
      gallery.id === galleryId 
        ? { ...gallery, isSaved: !gallery.isSaved }
        : gallery
    ))
  }

  const handleShareGallery = (gallery) => {
    if (navigator.share) {
      navigator.share({
        title: gallery.title,
        text: gallery.description,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${gallery.title}: ${gallery.description}`)
      setSuccessMessage('Gallery link copied to clipboard!')
    }
  }

  const handleDeleteGallery = async (galleryId) => {
    if (window.confirm('Are you sure you want to delete this gallery?')) {
      try {
        setLoading(true)
        await galleryAPI.deleteGallery(galleryId)
        setSuccessMessage('Gallery deleted successfully!')
        loadGalleries() // Refresh the list
      } catch (error) {
        console.error('Error deleting gallery:', error)
        setError('Failed to delete gallery. Please try again.')
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
            Inspiration Galleries
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={loadGalleries}
            disabled={loading}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Discover curated fashion moodboards and style inspiration from around the world.
        </Typography>

        {/* Search and Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search galleries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300, flexGrow: 1 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setSelectedCategory('all')}
          >
            Filters
          </Button>
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

        {/* Category Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {categories.map((category) => (
            <Chip
              key={category.value}
              label={category.label}
              onClick={() => setSelectedCategory(category.value)}
              color={selectedCategory === category.value ? 'primary' : 'default'}
              variant={selectedCategory === category.value ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && filteredGalleries.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredGalleries.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No galleries found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first gallery to get started!'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Create Gallery
          </Button>
        </Box>
      )}

      {/* Masonry Grid */}
      <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3, lg: 4 }, columnGap: 2 }}>
        {filteredGalleries.map((gallery) => (
          <Box
            key={gallery.id}
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
                  image={gallery.coverImage}
                  alt={gallery.title}
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
                      handleSaveGallery(gallery.id)
                    }}
                  >
                    {gallery.isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShareGallery(gallery)
                    }}
                  >
                    <Share />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' } }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteGallery(gallery.id)
                    }}
                  >
                    <MoreVert />
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
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLikeGallery(gallery.id)
                  }}
                >
                  {gallery.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {gallery.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {gallery.description}
                </Typography>

                {/* Author Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={gallery.authorAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    {gallery.author}
                  </Typography>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    {gallery.imageCount} pins
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {gallery.followers} followers
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
          </Box>
        ))}
      </Box>

      {/* Create Gallery Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Gallery</DialogTitle>
        <DialogContent>
          <MuiTextField
            autoFocus
            margin="dense"
            label="Gallery Title"
            fullWidth
            variant="outlined"
            value={newGallery.title}
            onChange={(e) => setNewGallery({...newGallery, title: e.target.value})}
            sx={{ mb: 2 }}
          />
          <MuiTextField
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
          <MuiTextField
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
            onClick={handleCreateGallery}
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

            <MuiTextField
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
          <Button onClick={() => setOpenAICreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateAIGallery}
            variant="contained"
            color="secondary"
            disabled={!aiGalleryParams.aesthetic || !aiGalleryParams.colors || !aiGalleryParams.season || loading}
          >
            {loading ? 'Generating...' : 'Generate AI Gallery'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setOpenCreateDialog(true)}
      >
        <Add />
      </Fab>

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

export default Gallery 