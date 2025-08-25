import React, { useState, useEffect } from 'react'
import { looksAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Fab,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Add,
  AutoAwesome,
  Refresh,
  Delete
} from '@mui/icons-material'

const Explore = () => {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openAILookDialog, setOpenAILookDialog] = useState(false)
  const [openUploadDialog, setOpenUploadDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  
  const [uploadForm, setUploadForm] = useState({
    title: '',
    aesthetic: '',
    tags: '',
    notes: '',
    image: null
  })
  const [aiLookParams, setAILookParams] = useState({
    style: '',
    occasion: '',
    season: '',
    colors: '',
    aesthetic: ''
  })
  const [runwayLooks, setRunwayLooks] = useState([])

  // Load runway looks from backend
  const loadRunwayLooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await looksAPI.getUploadedLooks()
      if (response.data && response.data.looks) {
        const transformedLooks = response.data.looks.map(look => ({
          id: look._id,
          title: look.title,
          description: look.description,
          image: look.image || look.imagePath ? `http://localhost:8000/uploads/${look.imagePath || look.image}` : 'https://via.placeholder.com/400x500/ff9ff3/ffffff?text=Look',
          style: look.style,
          occasion: look.occasion,
          aesthetic: look.aesthetic || [],
          tags: look.tags || [],
          notes: look.notes,
          sourceType: look.sourceType || 'Uploaded',
          isLiked: look.isLiked || false,
          isSaved: look.isSaved || false,
          createdAt: look.createdAt,
          updatedAt: look.updatedAt
        }))
        setRunwayLooks(transformedLooks)
      } else {
        setRunwayLooks([])
      }
    } catch (error) {
      console.error('Error loading runway looks:', error)
      setError('Failed to load runway looks. Please try again.')
      setRunwayLooks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRunwayLooks()
  }, [])

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' }
  ]

  const filteredLooks = runwayLooks.filter(look => {
    const matchesCategory = selectedCategory === 'all' || 
                           look.tags.some(tag => tag.toLowerCase().includes(selectedCategory)) ||
                           look.style?.toLowerCase().includes(selectedCategory)
    
    return matchesCategory
  })

  const handleGenerateAILook = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const lookData = {
        title: `AI ${aiLookParams.style} Look`,
        description: `AI-generated ${aiLookParams.style} look for ${aiLookParams.occasion}`,
        style: aiLookParams.style,
        occasion: aiLookParams.occasion,
        aesthetic: [aiLookParams.aesthetic].filter(Boolean),
        tags: [aiLookParams.style, aiLookParams.occasion, aiLookParams.season, aiLookParams.colors].filter(Boolean),
        notes: `AI-generated look with ${aiLookParams.aesthetic} aesthetic`,
        sourceType: 'AI'
      }
      
      const response = await looksAPI.createLook(lookData)
      
      if (response.data) {
        setSuccessMessage('AI Look generated successfully!')
        setOpenAILookDialog(false)
        setAILookParams({style: '', occasion: '', season: '', colors: '', aesthetic: ''})
        loadRunwayLooks() // Refresh the list
      }
    } catch (error) {
      console.error('Error generating AI look:', error)
      setError('Failed to generate AI look. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadLook = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Add sourceType to the upload form
      const uploadData = {
        ...uploadForm,
        sourceType: 'upload'
      }
      
      const response = await looksAPI.createLook(uploadData)
      
      if (response.data) {
        setSuccessMessage('Look uploaded successfully!')
        setOpenUploadDialog(false)
        setUploadForm({title: '', aesthetic: '', tags: '', notes: '', image: null})
        loadRunwayLooks() // Refresh the list
      }
    } catch (error) {
      console.error('Error uploading look:', error)
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to upload look. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }



  const handleLikeLook = async (lookId) => {
    try {
      console.log('Saving look with ID:', lookId)
      const response = await looksAPI.toggleLikeLook(lookId)
      
      if (response.data) {
        console.log('Save response:', response.data)
        // Update the look in the list with the new save status
        setRunwayLooks(prev => prev.map(look => 
          look.id === lookId 
            ? { ...look, isLiked: response.data.isLiked, isSaved: response.data.isSaved }
            : look
        ))
        
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
        console.log('Attempting to delete look with ID:', lookId)
        const response = await looksAPI.deleteLook(lookId)
        console.log('Delete response:', response)
        setSuccessMessage('Look deleted successfully!')
        loadRunwayLooks() // Refresh the list
      } catch (error) {
        console.error('Error deleting look:', error)
        console.error('Error response:', error.response)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete look. Please try again.'
        setError(`Failed to delete look: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Explore Runway Looks
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={loadRunwayLooks}
            disabled={loading}
            variant="outlined"
            sx={{ position: 'absolute', right: 0, top: 0 }}
          >
            Refresh
          </Button>
        </Box>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
          Discover the latest fashion trends from top designers and fashion houses around the world.
        </Typography>



        {/* Category Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3, justifyContent: 'center' }}>
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
      {loading && runwayLooks.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredLooks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {selectedCategory !== 'all' ? 'No looks found' : 'No runway looks yet'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {selectedCategory !== 'all' 
              ? 'Try adjusting your filters'
              : 'Upload your first runway look using the + button below'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenUploadDialog(true)}
          >
            Upload Look
          </Button>
        </Box>
      )}

      {/* Masonry Grid */}
      {filteredLooks.length > 0 && (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)', xl: 'repeat(5, 1fr)' },
          gap: 1.5
        }}>
          {filteredLooks.map((look) => (
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
                  sx={{ height: 'auto', width: '100%', border: '2px solid #000000' }}
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
                    sx={{ 
                      bgcolor: 'rgba(128,128,128,0.8)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(128,128,128,0.9)' } 
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShareLook(look)
                    }}
                  >
                    <Share />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(128,128,128,0.8)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(128,128,128,0.9)' } 
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Delete button clicked for look:', look.id)
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

              <CardContent sx={{ 
                p: 0.25, 
                display: 'flex', 
                flexDirection: 'column', 
                bgcolor: '#000000',
                minHeight: '60px',
                justifyContent: 'center'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', mb: 0.5, textAlign: 'center', color: '#ffffff' }}>
                  {look.title}
                </Typography>

                {/* Aesthetic Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: -1 }}>
                  <Chip 
                    label={look.aesthetic && look.aesthetic.length > 0 ? look.aesthetic[0] : 'Fashion'} 
                    size="small" 
                    sx={{ fontSize: '0.8rem', bgcolor: '#ffffff', color: '#000000' }} 
                  />
                  {look.aesthetic && look.aesthetic.length > 1 && (
                    <Chip label={`+${look.aesthetic.length - 1} more`} size="small" variant="outlined" sx={{ ml: 0.5, fontSize: '0.8rem', borderColor: '#ffffff', color: '#ffffff' }} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
        </Box>
      )}

      {/* AI Generate Look Dialog */}
      <Dialog open={openAILookDialog} onClose={() => setOpenAILookDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate AI Look</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Let AI create a personalized look based on your preferences. The AI will generate a completely AI-generated look that match your specified style, occasion, and aesthetic.
          </Typography>
          
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Style</InputLabel>
              <Select
                value={aiLookParams.style}
                label="Style"
                onChange={(e) => setAILookParams({...aiLookParams, style: e.target.value})}
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
                value={aiLookParams.occasion}
                label="Occasion"
                onChange={(e) => setAILookParams({...aiLookParams, occasion: e.target.value})}
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

            <FormControl fullWidth>
              <InputLabel>Season</InputLabel>
              <Select
                value={aiLookParams.season}
                label="Season"
                onChange={(e) => setAILookParams({...aiLookParams, season: e.target.value})}
              >
                <MenuItem value="spring">Spring</MenuItem>
                <MenuItem value="summer">Summer</MenuItem>
                <MenuItem value="fall">Fall</MenuItem>
                <MenuItem value="winter">Winter</MenuItem>
                <MenuItem value="all-season">All Season</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Color Palette</InputLabel>
              <Select
                value={aiLookParams.colors}
                label="Color Palette"
                onChange={(e) => setAILookParams({...aiLookParams, colors: e.target.value})}
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

            <FormControl fullWidth required>
              <InputLabel>Aesthetic *</InputLabel>
              <Select
                value={aiLookParams.aesthetic}
                label="Aesthetic *"
                onChange={(e) => setAILookParams({...aiLookParams, aesthetic: e.target.value})}
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAILookDialog(false)} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleGenerateAILook}
            variant="contained"
            color="secondary"
            disabled={!aiLookParams.style || !aiLookParams.occasion || !aiLookParams.season || !aiLookParams.aesthetic || loading}
          >
            {loading ? 'Generating...' : 'Generate AI Look'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Look Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Runway Look</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
              placeholder="e.g., Chanel Spring 2024"
            />
            
            <TextField
              fullWidth
              required
              label="Aesthetic (comma-separated) *"
              value={uploadForm.aesthetic}
              onChange={(e) => setUploadForm({...uploadForm, aesthetic: e.target.value})}
              placeholder="e.g., luxury, elegant, spring"
            />
            
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={uploadForm.tags}
              onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
              placeholder="e.g., Chanel, Spring, Paris, Luxury"
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={uploadForm.notes}
              onChange={(e) => setUploadForm({...uploadForm, notes: e.target.value})}
              placeholder="Description of the look..."
            />
            
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setUploadForm({...uploadForm, image: e.target.files[0]})}
              />
            </Button>
            {uploadForm.image && (
              <Typography variant="body2" color="text.secondary">
                Selected: {uploadForm.image.name}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleUploadLook}
            variant="contained"
            color="secondary"
            disabled={!uploadForm.title || !uploadForm.image || !uploadForm.aesthetic || loading}
          >
            {loading ? 'Uploading...' : 'Upload Look'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Fab
          color="secondary"
          aria-label="upload look"
          onClick={() => setOpenUploadDialog(true)}
          sx={{ mb: 1 }}
        >
          <Add />
        </Fab>
        <Fab
          color="primary"
          aria-label="generate AI look"
          onClick={() => setOpenAILookDialog(true)}
        >
          <AutoAwesome />
        </Fab>
      </Box>

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

export default Explore 