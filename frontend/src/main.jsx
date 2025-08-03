import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { GlobalStyles } from '@mui/material'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      light: '#f5f5f5',
      dark: '#e0e0e0',
      contrastText: '#000000',
    },
    secondary: {
      main: '#424242',
      light: '#616161',
      dark: '#212121',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: '#333333',
    action: {
      active: '#ffffff',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 200,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 200,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    h3: {
      fontWeight: 200,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    },
    h4: {
      fontWeight: 200,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    },
    h5: {
      fontWeight: 200,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    },
    h6: {
      fontWeight: 200,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
    body1: {
      fontWeight: 200,
      letterSpacing: '0.02em',
    },
    body2: {
      fontWeight: 200,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          border: '1px solid #333333',
          boxShadow: 'none',
          '&:hover': {
            border: '1px solid #424242',
          },
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          border: '1px solid #ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          borderRadius: 0,
          fontWeight: 200,
          letterSpacing: '0.05em',
        },
        contained: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        },
        outlined: {
          borderColor: '#424242',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#616161',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
        text: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: '#424242',
          color: '#ffffff',
        },
        outlined: {
          borderColor: '#616161',
          color: '#b0b0b0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderColor: '#424242',
            },
            '&:hover fieldset': {
              borderColor: '#616161',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
            },
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        primary: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        },
        secondary: {
          backgroundColor: '#424242',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#616161',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #333333',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333333',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          border: '1px solid #333333',
          borderRadius: 0,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          border: '1px solid #333333',
          borderRadius: 0,
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              background: 'linear-gradient(135deg, #f2ede3 0%, #f2ede3 50%, #0a0a0a 50%, #0a0a0a 100%)',
              backgroundAttachment: 'fixed',
              minHeight: '100vh',
            },
          }}
        />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
) 