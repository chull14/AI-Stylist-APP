import React, { useState, useEffect } from 'react'
import { looksAPI } from '../services/api'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material'
import { 
  AutoAwesome, 
  Refresh, 
  Favorite, 
  FavoriteBorder,
  Share,
  Delete,
  Add,
  Save
} from '@mui/icons-material'

const Looks = () => {
  const { user } = useAuth()
  const [looks, setLooks] = useState([])
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [likedLooks, setLikedLooks] = useState(new Set())
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false)
  const [newLook, setNewLook] = useState({
    title: '',
    description: '',
    style: '',
    occasion: '',
    items: []
  })
  const [generateParams, setGenerateParams] = useState({
    style: '',
    occasion: '',
    season: '',
    colorPreference: ''
  })

  const styles = ['Casual', 'Professional', 'Elegant', 'Bohemian', 'Minimalist', 'Streetwear', 'Vintage', 'Sporty']
  const occasions = ['Weekend', 'Work', 'Evening', 'Sport', 'Formal', 'Date Night', 'Travel', 'Party']
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All Season']
  const colors = ['Neutral', 'Warm', 'Cool', 'Pastel', 'Bold', 'Monochrome', 'Earth Tones', 'Jewel Tones']

  // Load looks from backend
  const loadLooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await looksAPI.getAllLooks()
      
      if (response.data && response.data.looks) {
        const transformedLooks = response.data.looks.map(look => ({
          id: look._id,
          title: look.title,
          description: look.description,
          image: look.image || 'https://via.placeholder.com/400x500/ff9ff3/ffffff?text=Look',
          style: look.style,
          occasion: look.occasion,
          items: look.items || [],
          isLiked: likedLooks.has(look._id),
          createdAt: look.createdAt,
          updatedAt: look.updatedAt
        }))
        setLooks(transformedLooks)
      } else {
        setLooks([])
      }
    } catch (error) {
      console.error('Error loading looks:', error)
      setError('Failed to load looks. Please try again.')
      // Fallback to sample data if API fails
      setLooks(getSampleLooks())
    } finally {
      setLoading(false)
    }
  }

  // Sample looks for fallback
  const getSampleLooks = () => [
    {
      id: 1,
      title: 'Casual Weekend Look',
      description: 'Perfect for brunch or shopping',
      image: 'https://via.placeholder.com/400x500/ff9ff3/ffffff?text=Weekend+Look',
      style: 'Casual',
      occasion: 'Weekend',
      items: ['Denim Jacket', 'White T-Shirt', 'Black Jeans', 'Sneakers'],
      isLiked: false
    },
    {
      id: 2,
      title: 'Office Professional',
      description: 'Smart and sophisticated for work',
      image: 'https://via.placeholder.com/400x500/54a0ff/ffffff?text=Office+Look',
      style: 'Professional',
      occasion: 'Work',
      items: ['Blazer', 'Blouse', 'Pencil Skirt', 'Heels'],
      isLiked: true
    },
    {
      id: 3,
      title: 'Evening Out',
      description: 'Elegant for dinner or events',
      image: 'https://via.placeholder.com/400x500/5f27cd/ffffff?text=Evening+Look',
      style: 'Elegant',
      occasion: 'Evening',
      items: ['Cocktail Dress', 'Statement Jewelry', 'Clutch', 'Heels'],
      isLiked: false
    }
  ]

  useEffect(() => {
    loadLooks()
  }, [])

  const filteredLooks = looks.filter(look => {
    const matchesStyle = !selectedStyle || look.style === selectedStyle
    const matchesOccasion = !selectedOccasion || look.occasion === selectedOccasion
    return matchesStyle && matchesOccasion
  })

  const handleCreateLook = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const lookData = {
        title: newLook.title,
        description: newLook.description,
        style: newLook.style,
        occasion: newLook.occasion,
        items: newLook.items
      }
      
      const response = await looksAPI.createLook(lookData)
      
      if (response.data) {
        setSuccessMessage('Look created successfully!')
        setOpenCreateDialog(false)
        setNewLook({title: '', description: '', style: '', occasion: '', items: []})
        loadLooks() // Refresh the list
      }
    } catch (error) {
      console.error('Error creating look:', error)
      setError('Failed to create look. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLook = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const lookData = {
        title: `AI ${generateParams.style} Look`,
        description: `AI-generated ${generateParams.style} look for ${generateParams.occasion}`,
        style: generateParams.style,
        occasion: generateParams.occasion,
        items: ['AI Generated Items'], // This would be populated by AI service
        season: generateParams.season,
        colorPreference: generateParams.colorPreference
      }
      
      const response = await looksAPI.createLook(lookData)
      
      if (response.data) {
        setSuccessMessage('AI Look generated successfully!')
        setOpenGenerateDialog(false)
        setGenerateParams({style: '', occasion: '', season: '', colorPreference: ''})
        loadLooks() // Refresh the list
      }
    } catch (error) {
      console.error('Error generating look:', error)
      setError('Failed to generate look. Please try again.')
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
        setLooks(prev => prev.map(look => 
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
        loadLooks() // Refresh the list
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
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            AI Generated Looks
          </Typography>
          <Button
            startIcon={<Refresh />}
            onClick={loadLooks}
            disabled={loading}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
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
                onClick={() => setOpenGenerateDialog(true)}
              >
                Generate New Look
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                fullWidth
                onClick={() => setOpenCreateDialog(true)}
              >
                Create Look
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && filteredLooks.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredLooks.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No looks found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {selectedStyle || selectedOccasion 
              ? 'Try adjusting your filters'
              : 'Create your first look to get started!'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Create Look
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredLooks.map((look) => (
          <Grid item xs={12} sm={6} md={4} key={look.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={look.image}
                  alt={look.title}
                />
                {/* Action buttons overlay */}
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
              </Box>
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
                  <Button 
                    size="small" 
                    startIcon={look.isLiked ? <Favorite /> : <FavoriteBorder />}
                    onClick={() => handleLikeLook(look.id)}
                    color={look.isLiked ? 'error' : 'inherit'}
                    sx={{
                      bgcolor: 'rgba(128,128,128,0.1)',
                      '&:hover': { bgcolor: 'rgba(128,128,128,0.2)' }
                    }}
                  >
                    {look.isLiked ? 'Liked' : 'Like'}
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

      {/* Create Look Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Look</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Look Title"
              fullWidth
              value={newLook.title}
              onChange={(e) => setNewLook({...newLook, title: e.target.value})}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newLook.description}
              onChange={(e) => setNewLook({...newLook, description: e.target.value})}
            />
            <FormControl fullWidth>
              <InputLabel>Style</InputLabel>
              <Select
                value={newLook.style}
                label="Style"
                onChange={(e) => setNewLook({...newLook, style: e.target.value})}
              >
                {styles.map((style) => (
                  <MenuItem key={style} value={style}>{style}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Occasion</InputLabel>
              <Select
                value={newLook.occasion}
                label="Occasion"
                onChange={(e) => setNewLook({...newLook, occasion: e.target.value})}
              >
                {occasions.map((occasion) => (
                  <MenuItem key={occasion} value={occasion}>{occasion}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Items (comma separated)"
              fullWidth
              placeholder="Denim Jacket, White T-Shirt, Black Jeans"
              value={newLook.items.join(', ')}
              onChange={(e) => setNewLook({...newLook, items: e.target.value.split(',').map(item => item.trim()).filter(Boolean)})}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateLook}
            variant="contained"
            disabled={!newLook.title || !newLook.description || !newLook.style || !newLook.occasion || loading}
          >
            {loading ? 'Creating...' : 'Create Look'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Look Dialog */}
      <Dialog open={openGenerateDialog} onClose={() => setOpenGenerateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate AI Look</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Let AI create a personalized look based on your preferences and closet items.
          </Typography>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Style</InputLabel>
              <Select
                value={generateParams.style}
                label="Style"
                onChange={(e) => setGenerateParams({...generateParams, style: e.target.value})}
              >
                {styles.map((style) => (
                  <MenuItem key={style} value={style}>{style}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Occasion</InputLabel>
              <Select
                value={generateParams.occasion}
                label="Occasion"
                onChange={(e) => setGenerateParams({...generateParams, occasion: e.target.value})}
              >
                {occasions.map((occasion) => (
                  <MenuItem key={occasion} value={occasion}>{occasion}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Season</InputLabel>
              <Select
                value={generateParams.season}
                label="Season"
                onChange={(e) => setGenerateParams({...generateParams, season: e.target.value})}
              >
                {seasons.map((season) => (
                  <MenuItem key={season} value={season}>{season}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Color Preference</InputLabel>
              <Select
                value={generateParams.colorPreference}
                label="Color Preference"
                onChange={(e) => setGenerateParams({...generateParams, colorPreference: e.target.value})}
              >
                {colors.map((color) => (
                  <MenuItem key={color} value={color}>{color}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGenerateDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleGenerateLook}
            variant="contained"
            color="secondary"
            disabled={!generateParams.style || !generateParams.occasion || loading}
          >
            {loading ? 'Generating...' : 'Generate Look'}
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

export default Looks 