import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { GlobalStyles } from '@mui/material'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#424242',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#666666',
      light: '#999999',
      dark: '#333333',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    divider: '#e0e0e0',
    action: {
      active: '#000000',
      hover: 'rgba(0, 0, 0, 0.08)',
      selected: 'rgba(0, 0, 0, 0.16)',
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
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            border: '1px solid #999999',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0',
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
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlined: {
          borderColor: '#666666',
          color: '#000000',
          '&:hover': {
            borderColor: '#999999',
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
        },
        text: {
          color: '#000000',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
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
          backgroundColor: '#666666',
          color: '#ffffff',
        },
        outlined: {
          borderColor: '#999999',
          color: '#666666',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#999999',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
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
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        secondary: {
          backgroundColor: '#666666',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#999999',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid #333333',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
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
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
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
              background: '#ffffff',
              minHeight: '100vh',
            },
          }}
        />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
) 