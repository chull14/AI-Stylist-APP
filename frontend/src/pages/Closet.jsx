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
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Blue Denim Jacket',
      category: 'Outerwear',
      color: 'Blue',
      image: 'https://via.placeholder.com/300x400/1976d2/ffffff?text=Jacket'
    },
    {
      id: 2,
      name: 'White T-Shirt',
      category: 'Tops',
      color: 'White',
      image: 'https://via.placeholder.com/300x400/ffffff/000000?text=T-Shirt'
    }
  ])

  const categories = ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Shoes', 'Accessories']
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink', 'Brown', 'Gray']

  // Load closet items from backend
  useEffect(() => {
    const loadClosetItems = async () => {
      try {
        setLoading(true)
        const response = await closetAPI.getCloset()
        // TODO: Replace with actual backend data
        console.log('Loaded closet items:', response.data)
      } catch (error) {
        console.error('Error loading closet items:', error)
      } finally {
        setLoading(false)
      }
    }

    loadClosetItems()
  }, [])

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

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={item.image}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.category} • {item.color}
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
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select label="Category">
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Color</InputLabel>
            <Select label="Color">
              {colors.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" component="label" fullWidth>
            Upload Image
            <input type="file" hidden accept="image/*" />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} variant="contained">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Closet 