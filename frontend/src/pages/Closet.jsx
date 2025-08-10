import React, { useState, useEffect } from 'react'
import { closetAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
  IconButton,
  Chip
} from '@mui/material'
import { Add, Edit, Delete, Refresh } from '@mui/icons-material'

const Closet = () => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    color: '',
    brand: '',
    notes: '',
    aesthetic: '',
    colors: '',
    tags: '',
    image: null
  })

  const categories = ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Shoes', 'Accessories']
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Brown', 'Gray']

  // Load closet items from backend
  const loadClosetItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await closetAPI.getCloset()
      if (response.data && response.data.closet) {
        setItems(response.data.closet)
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Error loading closet items:', error)
      setError('Failed to load closet items. Please try again.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClosetItems()
  }, [])

  const handleAddItem = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setNewItem({
      name: '', category: '', color: '', brand: '', notes: '',
      aesthetic: '', colors: '', tags: '', image: null
    })
  }

  const handleUploadItem = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await closetAPI.uploadItem(newItem)
      
      if (response.data) {
        setSuccessMessage('Item added successfully!')
        handleClose()
        loadClosetItems() // Refresh the list
      }
    } catch (error) {
      console.error('Error adding closet item:', error)
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to add item. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setLoading(true)
        setError(null)
        
        await closetAPI.deleteClosetItem(itemId)
        setSuccessMessage('Item deleted successfully!')
        loadClosetItems() // Refresh the list
      } catch (error) {
        console.error('Error deleting item:', error)
        setError('Failed to delete item. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          My Closet
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<Refresh />}
            onClick={loadClosetItems}
            disabled={loading}
            variant="outlined"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddItem}
            disabled={loading}
          >
            Add Item
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && items.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your closet is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add your first clothing item using the "Add Item" button above
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddItem}
          >
            Add Your First Item
          </Button>
        </Box>
      )}

      {/* Items Grid */}
      {items.length > 0 && (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id || item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={item.imagePath ? `http://localhost:8000/uploads/${item.imagePath.split('/').pop()}` : item.image}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {item.category || 'Uncategorized'} • {item.brand || 'No brand'}
                  </Typography>
                  
                  {/* Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {item.colors && item.colors.slice(0, 3).map((color) => (
                      <Chip key={color} label={color} size="small" variant="outlined" />
                    ))}
                    {item.colors && item.colors.length > 3 && (
                      <Chip label={`+${item.colors.length - 3}`} size="small" variant="outlined" />
                    )}
                  </Box>
                  
                  {item.notes && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {item.notes.length > 50 ? `${item.notes.substring(0, 50)}...` : item.notes}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<Edit />}>
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<Delete />}
                    onClick={() => handleDeleteItem(item._id || item.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Item Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            variant="outlined"
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select 
              label="Category"
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Color</InputLabel>
            <Select 
              label="Color"
              value={newItem.color}
              onChange={(e) => setNewItem({...newItem, color: e.target.value})}
            >
              {colors.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Brand"
            fullWidth
            variant="outlined"
            value={newItem.brand}
            onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Aesthetic (comma-separated)"
            fullWidth
            variant="outlined"
            value={newItem.aesthetic}
            onChange={(e) => setNewItem({...newItem, aesthetic: e.target.value})}
            placeholder="e.g., minimalist, elegant, casual"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Colors (comma-separated)"
            fullWidth
            variant="outlined"
            value={newItem.colors}
            onChange={(e) => setNewItem({...newItem, colors: e.target.value})}
            placeholder="e.g., blue, white, black"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            fullWidth
            variant="outlined"
            value={newItem.tags}
            onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
            placeholder="e.g., denim, casual, spring"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newItem.notes}
            onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
            placeholder="Additional notes about this item..."
            sx={{ mb: 2 }}
          />
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            sx={{ mb: 2 }}
          >
            Upload Image
            <input 
              type="file" 
              hidden 
              accept="image/*"
              onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})}
            />
          </Button>
          {newItem.image && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selected: {newItem.image.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleUploadItem}
            variant="contained"
            disabled={!newItem.name || !newItem.image || loading}
          >
            {loading ? 'Adding...' : 'Add Item'}
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

export default Closet 