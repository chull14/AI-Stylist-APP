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
  Search,
  Add,
  AutoAwesome,
  Refresh,
  Delete
} from '@mui/icons-material'

const Explore = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
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
      const response = await looksAPI.getAllLooks()
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
    { value: 'all', label: 'All Looks' },
    { value: 'spring', label: 'Spring 2024' },
    { value: 'fall', label: 'Fall 2024' },
    { value: 'couture', label: 'Haute Couture' },
    { value: 'cruise', label: 'Cruise' },
    { value: 'paris', label: 'Paris Fashion Week' },
    { value: 'milan', label: 'Milan Fashion Week' }
  ]

  const filteredLooks = runwayLooks.filter(look => {
    const matchesSearch = look.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         look.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         look.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           look.tags.some(tag => tag.toLowerCase().includes(selectedCategory)) ||
                           look.style?.toLowerCase().includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  const handleUploadLook = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await looksAPI.createLook(uploadForm)
      
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
        await looksAPI.deleteLook(lookId)
        setSuccessMessage('Look deleted successfully!')
        loadRunwayLooks() // Refresh the list
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
            Explore Runway Looks
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={loadRunwayLooks}
            disabled={loading}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Discover the latest fashion trends from top designers and fashion houses around the world.
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search looks, designers, or collections..."
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
            variant="contained"
            startIcon={<AutoAwesome />}
            onClick={() => setOpenAILookDialog(true)}
            disabled={loading}
          >
            Generate AI Look
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
      {loading && runwayLooks.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredLooks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || selectedCategory !== 'all' ? 'No looks found' : 'No runway looks yet'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
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
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2
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
                    sx={{ bgcolor: 'rgba(128,128,128,0.8)', '&:hover': { bgcolor: 'rgba(128,128,128,0.9)' } }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShareLook(look)
                    }}
                  >
                    <Share />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'rgba(128,128,128,0.8)', '&:hover': { bgcolor: 'rgba(128,128,128,0.9)' } }}
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
                    {look.createdAt ? `Uploaded ${new Date(look.createdAt).toLocaleDateString()}` : 'Recently uploaded'}
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

            <FormControl fullWidth>
              <InputLabel>Aesthetic</InputLabel>
              <Select
                value={aiLookParams.aesthetic}
                label="Aesthetic"
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
            disabled={!aiLookParams.style || !aiLookParams.occasion || !aiLookParams.season || loading}
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
              label="Aesthetic (comma-separated)"
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
            disabled={!uploadForm.title || !uploadForm.image || loading}
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