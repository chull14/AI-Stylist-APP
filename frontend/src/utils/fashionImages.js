// Real fashion runway images from Unsplash
// These are high-quality fashion photography images

export const runwayImages = {
  // Chanel Spring 2024
  chanelSpring: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop&crop=center',
  
  // Balenciaga Fall 2024
  balenciagaFall: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop&crop=center',
  
  // Dior Haute Couture
  diorCouture: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=700&fit=crop&crop=center',
  
  // Gucci Spring 2024
  gucciSpring: 'https://images.unsplash.com/photo-1551048632-8df86d5b8144?w=400&h=550&fit=crop&crop=center',
  
  // Prada Fall 2024
  pradaFall: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=650&fit=crop&crop=center',
  
  // Louis Vuitton Cruise
  lvCruise: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=580&fit=crop&crop=center',
  
  // Saint Laurent Fall 2024
  yslFall: 'https://images.unsplash.com/photo-1551048632-8df86d5b8144?w=400&h=600&fit=crop&crop=center',
  
  // Versace Spring 2024
  versaceSpring: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&crop=center'
}

export const galleryImages = {
  // Summer Street Style
  summerStyle: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop&crop=center',
  
  // Evening Elegance
  eveningElegance: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop&crop=center',
  
  // Minimalist Chic
  minimalistChic: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=700&fit=crop&crop=center',
  
  // Boho Vibes
  bohoVibes: 'https://images.unsplash.com/photo-1551048632-8df86d5b8144?w=400&h=550&fit=crop&crop=center',
  
  // Workwear Essentials
  workwearEssentials: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=650&fit=crop&crop=center',
  
  // Vintage Revival
  vintageRevival: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=580&fit=crop&crop=center'
}

export const closetImages = {
  // Blue Denim Jacket
  denimJacket: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop&crop=center',
  
  // White T-Shirt
  whiteTshirt: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop&crop=center',
  
  // Black Dress
  blackDress: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop&crop=center',
  
  // Leather Jacket
  leatherJacket: 'https://images.unsplash.com/photo-1551048632-8df86d5b8144?w=300&h=400&fit=crop&crop=center',
  
  // Summer Dress
  summerDress: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop&crop=center',
  
  // Formal Suit
  formalSuit: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop&crop=center'
}

// Function to get a random fashion image
export const getRandomFashionImage = (width = 400, height = 600) => {
  const images = [
    'https://images.unsplash.com/photo-1445205170230-053b83016050',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
    'https://images.unsplash.com/photo-1551048632-8df86d5b8144',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256',
    'https://images.unsplash.com/photo-1445205170230-053b83016050',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1'
  ]
  
  const randomImage = images[Math.floor(Math.random() * images.length)]
  return `${randomImage}?w=${width}&h=${height}&fit=crop&crop=center`
}

// Function to get image for specific designer/collection
export const getDesignerImage = (designer, collection) => {
  const designerKey = designer.toLowerCase().replace(/\s+/g, '')
  const collectionKey = collection.toLowerCase().replace(/\s+/g, '')
  
  // Try to find specific image
  const specificKey = `${designerKey}${collectionKey}`
  if (runwayImages[specificKey]) {
    return runwayImages[specificKey]
  }
  
  // Fallback to random fashion image
  return getRandomFashionImage()
} 