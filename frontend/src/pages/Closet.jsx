import React, { useState, useEffect } from 'react'
import { closetAPI } from '../services/api'
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
  MenuItem
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'

const Closet = () => {
  const [open, setOpen] = useState(false)
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
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  // Load closet items from backend
  const loadClosetItems = async () => {
    try {
      setLoading(true)
      const response = await closetAPI.getCloset()
      if (response.data && response.data.closet) {
        setItems(response.data.closet)
      }
    } catch (error) {
      console.error('Error loading closet items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClosetItems()
  }, [])

  const categories = ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Shoes', 'Accessories']
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Brown', 'Gray']



  const handleAddItem = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          My Closet
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddItem}
        >
          Add Item
        </Button>
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your closet is empty
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Add your first clothing item using the "Add Item" button above
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={item.imagePath ? `http://localhost:8000/uploads/${item.imagePath.split('/').pop()}` : item.image}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.category || 'Uncategorized'} • {item.colors ? item.colors.join(', ') : 'No color specified'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Edit />}>
                  Edit
                </Button>
                <Button size="small" color="error" startIcon={<Delete />}>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={async () => {
              try {
                await closetAPI.uploadItem(newItem)
                handleClose()
                setNewItem({
                  name: '', category: '', color: '', brand: '', notes: '',
                  aesthetic: '', colors: '', tags: '', image: null
                })
                // Refresh closet items after successful upload
                await loadClosetItems()
              } catch (error) {
                console.error('Error adding closet item:', error)
              }
            }} 
            variant="contained"
            disabled={!newItem.name || !newItem.image}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Closet 