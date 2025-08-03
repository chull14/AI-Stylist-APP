import React, { useState, useEffect } from 'react'
import { galleryAPI } from '../services/api'
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
  Stack
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
  AutoAwesome
} from '@mui/icons-material'

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
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

  const galleries = [
    {
      id: 1,
      title: 'Summer Street Style',
      description: 'Casual and chic summer looks for everyday inspiration',
      coverImage: 'https://via.placeholder.com/400x600/ff6b6b/ffffff?text=Summer+Style',
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
      coverImage: 'https://via.placeholder.com/400x500/4ecdc4/ffffff?text=Evening+Elegance',
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
      coverImage: 'https://via.placeholder.com/400x700/45b7d1/ffffff?text=Minimalist',
      imageCount: 32,
      followers: 234,
      author: 'MinimalStyle',
      authorAvatar: 'https://via.placeholder.com/40x40/45b7d1/ffffff?text=M',
      tags: ['Minimalist', 'Clean', 'Modern', 'Simple'],
      isSaved: false,
      isLiked: true
    },
    {
      id: 4,
      title: 'Boho Vibes',
      description: 'Bohemian and free-spirited looks for the adventurous soul',
      coverImage: 'https://via.placeholder.com/400x550/96ceb4/ffffff?text=Boho',
      imageCount: 15,
      followers: 67,
      author: 'BohoChic',
      authorAvatar: 'https://via.placeholder.com/40x40/96ceb4/ffffff?text=B',
      tags: ['Bohemian', 'Free-spirited', 'Natural', 'Creative'],
      isSaved: true,
      isLiked: true
    },
    {
      id: 5,
      title: 'Workwear Essentials',
      description: 'Professional and polished looks for the workplace',
      coverImage: 'https://via.placeholder.com/400x650/f7b731/ffffff?text=Workwear',
      imageCount: 28,
      followers: 189,
      author: 'CareerStyle',
      authorAvatar: 'https://via.placeholder.com/40x40/f7b731/ffffff?text=C',
      tags: ['Professional', 'Work', 'Business', 'Polished'],
      isSaved: false,
      isLiked: false
    },
    {
      id: 6,
      title: 'Vintage Revival',
      description: 'Classic vintage looks with a modern twist',
      coverImage: 'https://via.placeholder.com/400x580/e17055/ffffff?text=Vintage',
      imageCount: 22,
      followers: 145,
      author: 'VintageVibe',
      authorAvatar: 'https://via.placeholder.com/40x40/e17055/ffffff?text=V',
      tags: ['Vintage', 'Classic', 'Retro', 'Timeless'],
      isSaved: true,
      isLiked: true
    }
  ]

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
  useEffect(() => {
    const loadGalleries = async () => {
      try {
        setLoading(true)
        const response = await galleryAPI.getAllGalleries()
        // TODO: Replace with actual backend data
        console.log('Loaded galleries:', response.data)
      } catch (error) {
        console.error('Error loading galleries:', error)
      } finally {
        setLoading(false)
      }
    }

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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Inspiration Galleries
        </Typography>
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
                  >
                    {gallery.isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
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
            label="Cover Image URL"
            fullWidth
            variant="outlined"
            value={newGallery.coverImage}
            onChange={(e) => setNewGallery({...newGallery, coverImage: e.target.value})}
            sx={{ mb: 2 }}
          />
          <MuiTextField
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
            onClick={async () => {
              try {
                setLoading(true)
                await galleryAPI.createGallery(newGallery)
                console.log('Gallery created successfully')
                setOpenCreateDialog(false)
                setNewGallery({title: '', description: '', coverImage: '', tags: []})
                // TODO: Refresh galleries list
              } catch (error) {
                console.error('Error creating gallery:', error)
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

            <MuiTextField
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
            onClick={async () => {
              try {
                setLoading(true)
                // TODO: Call AI service to generate gallery
                console.log('AI Gallery Params:', aiGalleryParams)
                // For now, create a gallery with AI parameters
                const aiGalleryData = {
                  title: aiGalleryParams.title || `AI ${aiGalleryParams.aesthetic} Gallery`,
                  description: `AI-generated gallery with ${aiGalleryParams.aesthetic} aesthetic, ${aiGalleryParams.colors} colors, ${aiGalleryParams.season} season`,
                  coverImage: 'https://via.placeholder.com/400x600/4ecdc4/ffffff?text=AI+Generated',
                  tags: [aiGalleryParams.aesthetic, aiGalleryParams.colors, aiGalleryParams.season, aiGalleryParams.style, aiGalleryParams.occasion].filter(Boolean)
                }
                await galleryAPI.createGallery(aiGalleryData)
                console.log('AI Gallery created successfully')
                setOpenAICreateDialog(false)
                setAIGalleryParams({aesthetic: '', colors: '', season: '', style: '', occasion: '', title: ''})
                // TODO: Refresh galleries list
              } catch (error) {
                console.error('Error creating AI gallery:', error)
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
    </Box>
  )
}

export default Gallery 