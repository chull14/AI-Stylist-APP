# AI Stylist App

A comprehensive AI-powered fashion styling application that helps users curate their personal style through intelligent outfit suggestions, closet management, and inspiration galleries.

## 🎯 Features

- **AI-Powered Styling**: Intelligent outfit combinations from user's closet
- **Personal Closet Management**: Upload and organize your clothing items
- **Inspiration Galleries**: Curated fashion runway looks and trends
- **Shopping Recommendations**: AI-suggested purchases from platforms like Depop and Grailed
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Modern, clean UI that works on all devices

## 🏗️ Project Structure

```
AI-Stylist-APP/
├── backend/           # Express.js API server
│   ├── config/       # Database and app configuration
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Custom middleware
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API route definitions
│   └── uploads/      # File uploads
├── frontend/         # React.js client application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service functions
│   │   ├── context/     # React context providers
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your configuration:
   ```env
   DATABASE_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   PORT=8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/logout` - User logout
- `GET /api/refresh` - Refresh access token

### User Management
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `DELETE /api/users/:userId` - Delete user account

### Closet Management
- `GET /api/users/:userId/closet` - Get user's closet items
- `POST /api/users/:userId/closet` - Add item to closet
- `PUT /api/users/:userId/closet/:itemId` - Update closet item
- `DELETE /api/users/:userId/closet/:itemId` - Remove item from closet

### Galleries
- `GET /api/users/:userId/galleries` - Get user's galleries
- `POST /api/users/:userId/galleries` - Create new gallery
- `PUT /api/users/:userId/galleries/:galleryId` - Update gallery
- `DELETE /api/users/:userId/galleries/:galleryId` - Delete gallery

### Looks
- `GET /api/users/:userId/looks` - Get user's looks
- `POST /api/users/:userId/looks` - Create new look
- `PUT /api/users/:userId/looks/:lookId` - Update look
- `DELETE /api/users/:userId/looks/:lookId` - Delete look

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Material-UI** - Component library
- **Axios** - HTTP client
- **Vite** - Build tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🎨 Future Enhancements

- AI-powered style analysis
- Integration with fashion e-commerce APIs
- Social features and sharing
- Advanced filtering and search
- Mobile app development
- AI-generated outfit descriptions 