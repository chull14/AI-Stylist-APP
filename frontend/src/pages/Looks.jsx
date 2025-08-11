import React, { useState, useEffect } from 'react'
import { looksAPI, galleryAPI } from '../services/api'
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
  Delete
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
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false)
  const [openAICreateDialog, setOpenAICreateDialog] = useState(false)
  const [generateParams, setGenerateParams] = useState({
    style: '',
    occasion: '',
    season: '',
    colorPreference: ''
  })
  const [aiGalleryParams, setAIGalleryParams] = useState({
    aesthetic: '',
    colors: '',
    season: '',
    style: '',
    occasion: '',
    title: ''
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
          image: look.image || look.imagePath ? `http://localhost:8000/uploads/${look.imagePath || look.image}` : 'https://via.placeholder.com/400x500/ff9ff3/ffffff?text=Look',
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
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="contained"
                startIcon={<AutoAwesome />}
                fullWidth
                onClick={() => setOpenGenerateDialog(true)}
              >
                Generate New Look
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AutoAwesome />}
                fullWidth
                onClick={() => setOpenAICreateDialog(true)}
              >
                AI Create Gallery
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
              : 'Generate your first AI look to get started!'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<AutoAwesome />}
            onClick={() => setOpenGenerateDialog(true)}
          >
            Generate AI Look
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

export default Looks 