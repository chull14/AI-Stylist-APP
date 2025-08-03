import React, { useState } from 'react'
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
  Stack
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
  AutoAwesome
} from '@mui/icons-material'

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openAILookDialog, setOpenAILookDialog] = useState(false)
  const [aiLookParams, setAILookParams] = useState({
    style: '',
    occasion: '',
    season: '',
    colors: '',
    aesthetic: ''
  })

  const runwayLooks = [
    {
      id: 1,
      title: 'Chanel Spring 2024',
      designer: 'Chanel',
      season: 'Spring 2024',
      image: 'https://via.placeholder.com/400x600/ff6b6b/ffffff?text=Chanel+Spring',
      likes: 1247,
      isLiked: false,
      isSaved: false,
      tags: ['Chanel', 'Spring', 'Luxury', 'Paris'],
      description: 'Elegant spring collection featuring pastel colors and floral motifs'
    },
    {
      id: 2,
      title: 'Balenciaga Fall 2024',
      designer: 'Balenciaga',
      season: 'Fall 2024',
      image: 'https://via.placeholder.com/400x500/4ecdc4/ffffff?text=Balenciaga+Fall',
      likes: 892,
      isLiked: true,
      isSaved: true,
      tags: ['Balenciaga', 'Fall', 'Avant-garde', 'Paris'],
      description: 'Bold and innovative designs pushing fashion boundaries'
    },
    {
      id: 3,
      title: 'Dior Haute Couture',
      designer: 'Dior',
      season: 'Haute Couture 2024',
      image: 'https://via.placeholder.com/400x700/45b7d1/ffffff?text=Dior+Couture',
      likes: 2156,
      isLiked: true,
      isSaved: false,
      tags: ['Dior', 'Haute Couture', 'Luxury', 'Paris'],
      description: 'Exquisite craftsmanship meets timeless elegance'
    },
    {
      id: 4,
      title: 'Gucci Spring 2024',
      designer: 'Gucci',
      season: 'Spring 2024',
      image: 'https://via.placeholder.com/400x550/96ceb4/ffffff?text=Gucci+Spring',
      likes: 1567,
      isLiked: false,
      isSaved: true,
      tags: ['Gucci', 'Spring', 'Luxury', 'Milan'],
      description: 'Playful and vibrant collection with bold prints and colors'
    },
    {
      id: 5,
      title: 'Prada Fall 2024',
      designer: 'Prada',
      season: 'Fall 2024',
      image: 'https://via.placeholder.com/400x650/f7b731/ffffff?text=Prada+Fall',
      likes: 943,
      isLiked: true,
      isSaved: true,
      tags: ['Prada', 'Fall', 'Minimalist', 'Milan'],
      description: 'Clean lines and sophisticated minimalism'
    },
    {
      id: 6,
      title: 'Louis Vuitton Cruise',
      designer: 'Louis Vuitton',
      season: 'Cruise 2024',
      image: 'https://via.placeholder.com/400x580/e17055/ffffff?text=LV+Cruise',
      likes: 1789,
      isLiked: false,
      isSaved: false,
      tags: ['Louis Vuitton', 'Cruise', 'Luxury', 'Paris'],
      description: 'Travel-inspired collection with global influences'
    },
    {
      id: 7,
      title: 'Saint Laurent Fall 2024',
      designer: 'Saint Laurent',
      season: 'Fall 2024',
      image: 'https://via.placeholder.com/400x600/6c5ce7/ffffff?text=YSL+Fall',
      likes: 1123,
      isLiked: true,
      isSaved: false,
      tags: ['Saint Laurent', 'Fall', 'Paris', 'Luxury'],
      description: 'Sophisticated and powerful designs for the modern woman'
    },
    {
      id: 8,
      title: 'Versace Spring 2024',
      designer: 'Versace',
      season: 'Spring 2024',
      image: 'https://via.placeholder.com/400x500/00b894/ffffff?text=Versace+Spring',
      likes: 1345,
      isLiked: false,
      isSaved: true,
      tags: ['Versace', 'Spring', 'Glamour', 'Milan'],
      description: 'Bold prints and glamorous designs for the confident woman'
    }
  ]

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
                         look.designer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         look.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         look.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           look.tags.some(tag => tag.toLowerCase().includes(selectedCategory)) ||
                           look.season.toLowerCase().includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Explore Runway Looks
        </Typography>
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

      {/* Masonry Grid */}
      <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3, lg: 4 }, columnGap: 2 }}>
        {filteredLooks.map((look) => (
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
                    {look.isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
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
                  {look.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {look.title}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
                  {look.designer}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {look.description}
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

      {/* AI Generate Look Dialog */}
      <Dialog open={openAILookDialog} onClose={() => setOpenAILookDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate AI Look</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Let AI create a personalized look based on your preferences. The AI will generate outfit combinations that match your specified style, occasion, and aesthetic.
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
          <Button onClick={() => setOpenAILookDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              // TODO: Call AI service to generate look
              console.log('AI Look Params:', aiLookParams)
              setOpenAILookDialog(false)
              setAILookParams({style: '', occasion: '', season: '', colors: '', aesthetic: ''})
            }} 
            variant="contained"
            color="secondary"
            disabled={!aiLookParams.style || !aiLookParams.occasion || !aiLookParams.season}
          >
            Generate AI Look
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="generate"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => setOpenAILookDialog(true)}
      >
        <AutoAwesome />
      </Fab>
    </Box>
  )
}

export default Explore 