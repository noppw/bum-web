import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LanguageProvider } from './contexts/LanguageContext';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import Suppliers from './components/Suppliers';
import Products from './components/Products';
import AccessManagement from './components/AccessManagement';
import Sales from './components/Sales';
import Customers from './components/Customers';
import Installment from './components/Installment';
import Purchase from './components/Purchase';
import PurchaseInstallment from './components/PurchaseInstallment';
import Inventory from './components/Inventory';
import { useUser } from '@clerk/clerk-react';
import Login from './components/Login';

export const ColorModeContext = React.createContext<{ mode: 'light' | 'dark'; toggle: () => void; isAuto: boolean; colorMode: string }>({ mode: 'light', toggle: () => {}, isAuto: false, colorMode: 'light' });

const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'light' ? '#fafafa' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#111827',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '6px 12px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiTableHead-root': {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#374151',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        sizeSmall: {
          paddingTop: 6,
          paddingBottom: 6,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #374151',
          backgroundColor: mode === 'light' ? '#f8f9fb' : '#1f2937',
        },
      },
    },
  },
});

function RequireAuth({ children }: { children: React.ReactNode }): JSX.Element {
  const { isLoaded, isSignedIn, user } = useUser();
  
  // eslint-disable-next-line no-console
  console.log('RequireAuth - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'user:', user);
  
  if (!isLoaded) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Loading...</Typography>
      </Box>
    );
  }
  if (!isSignedIn) {
    // eslint-disable-next-line no-console
    console.log('User not signed in, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // eslint-disable-next-line no-console
  console.log('User is signed in, rendering children');
  return <>{children}</>;
}

function App() {
  // Authentication is handled by Clerk components and hooks
  const [colorMode, setColorMode] = React.useState<string>(() => {
    const saved = localStorage.getItem('colorMode');
    return saved || 'auto';
  });

  const [mode, setMode] = React.useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('colorMode');
    if (saved === 'dark' || saved === 'light') {
      return saved as 'light' | 'dark';
    }
    // Auto-detect system preference if no saved preference or auto mode
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  React.useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  // Listen for system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if explicitly in auto mode
      if (colorMode === 'auto') {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [colorMode]);

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  const toggleColorMode = () => {
    if (colorMode === 'light') {
      setMode('dark');
      setColorMode('dark');
    } else if (colorMode === 'dark') {
      // Set to auto mode
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
      setColorMode('auto');
    } else {
      // If auto or no preference, set to light
      setMode('light');
      setColorMode('light');
    }
  };

  const isAuto = colorMode === 'auto';

  return (
    <LanguageProvider>
      <ColorModeContext.Provider value={{ mode, toggle: toggleColorMode, isAuto, colorMode }}>
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/login/sso-callback" element={<Login />} />
            <Route 
              path="/" 
              element={
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/suppliers" 
              element={
                <RequireAuth>
                  <Layout>
                    <Suppliers />
                  </Layout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/products" 
              element={
                <RequireAuth>
                  <Layout>
                    <Products />
                  </Layout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/access" 
              element={
                <RequireAuth>
                  <Layout>
                    <AccessManagement />
                  </Layout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/sales" 
              element={
                <RequireAuth>
                  <Layout>
                    <Sales />
                  </Layout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <RequireAuth>
                  <Layout>
                    <Customers />
                  </Layout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <RequireAuth>
                  <Layout>
                    <Inventory />
                  </Layout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/installment" 
              element={
                <RequireAuth>
                  <Layout>
                    <Installment />
                  </Layout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/purchase" 
              element={
                <RequireAuth>
                  <Layout>
                    <Purchase />
                  </Layout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/purchase-installment" 
              element={
                <RequireAuth>
                  <Layout>
                    <PurchaseInstallment />
                  </Layout>
                </RequireAuth>
              } 
            />
          </Routes>
        </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LanguageProvider>
  );
}

export default App; 