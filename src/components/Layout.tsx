import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Select,
  FormControl,
  Collapse,
  TextField,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Language as LanguageIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  Search as SearchIcon,
  HelpOutline as HelpOutlineIcon,
  NotificationsNone as NotificationsNoneIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface User {
  username: string;
  role: string;
}

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [salesMenuOpen, setSalesMenuOpen] = useState(true);
  const [purchaseMenuOpen, setPurchaseMenuOpen] = useState(true);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const menuItems = [
    { text: t('nav.dashboard'), path: '/dashboard' },
    { 
      text: t('nav.purchase'), 
      path: '/purchase',
      hasSubmenu: true,
      submenu: [
        { text: 'Your purchase', path: '/purchase' },
        { text: t('nav.purchaseInstallment'), path: '/purchase-installment' },
      ]
    },
    { 
      text: t('nav.sales'), 
      path: '/sales',
      hasSubmenu: true,
      submenu: [
        { text: 'Your sales', path: '/sales' },
        { text: t('nav.installment'), path: '/installment' },
      ]
    },
    { text: t('nav.customers'), path: '/customers' },
    { text: t('nav.suppliers'), path: '/suppliers' },
    { text: t('nav.products'), path: '/products' },
    { text: t('nav.inventory'), path: '/inventory' },
    { text: t('nav.access'), path: '/access' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSalesMenuToggle = () => {
    setSalesMenuOpen(!salesMenuOpen);
  };
  const handlePurchaseMenuToggle = () => {
    setPurchaseMenuOpen(!purchaseMenuOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleMenuClose();
  };

  const handleLanguageChange = (event: any) => {
    setLanguage(event.target.value);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {!sidebarCollapsed && (
          <Typography variant="h6" noWrap component="div">
            Traceback System
          </Typography>
        )}
        <IconButton 
          onClick={handleSidebarToggle} 
          sx={{ ml: sidebarCollapsed ? 0 : 'auto' }}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      {!sidebarCollapsed && (
      <List
        sx={{
          py: 1,
          '& .MuiListItemButton-root': {
            borderLeft: '3px solid transparent',
            minHeight: 40,
            '&:hover': {
              backgroundColor: '#eef3f8',
            },
          },
          '& .MuiListItemButton-root.Mui-selected': {
            backgroundColor: 'transparent',
            borderLeftColor: '#1f73b7',
            '&:hover': {
              backgroundColor: '#e8f1f8',
            },
          },
          '& .MuiListItemIcon-root': {
            color: 'text.secondary',
          },
        }}
      >
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            {/* Section headers removed per request */}
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  if (item.hasSubmenu) {
                    if (item.path === '/sales') {
                      handleSalesMenuToggle();
                    } else if (item.path === '/purchase') {
                      handlePurchaseMenuToggle();
                    }
                  } else {
                    navigate(item.path);
                  }
                }}
                sx={{
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  px: sidebarCollapsed ? 1 : 2,
                  minHeight: 40,
                }}
                title={sidebarCollapsed ? item.text : ''}
              >
                {/* Icons removed from menu items */}
                {!sidebarCollapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.92rem',
                      fontWeight: location.pathname === item.path ? 600 : 500,
                    }}
                  />
                )}
                {!sidebarCollapsed && item.hasSubmenu && (
                  (item.path === '/sales' ? (salesMenuOpen ? <ExpandLess /> : <ExpandMore />) : (purchaseMenuOpen ? <ExpandLess /> : <ExpandMore />))
                )}
              </ListItemButton>
            </ListItem>
            {item.hasSubmenu && !sidebarCollapsed && (
              <Collapse in={item.path === '/sales' ? salesMenuOpen : purchaseMenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu?.map((subItem) => (
                    <ListItem key={subItem.text} disablePadding>
                      <ListItemButton
                        selected={location.pathname === subItem.path}
                        onClick={() => navigate(subItem.path)}
                        sx={{
                          pl: 4.5,
                          minHeight: 36,
                        }}
                      >
                        {/* Icons removed from submenu items */}
                        <ListItemText
                          primary={subItem.text}
                          primaryTypographyProps={{ fontSize: '0.9rem' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      )}
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          ml: { sm: `${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px` },
          bgcolor: 'primary.main',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Toolbar sx={{ minHeight: '44px !important', py: 0, gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography noWrap component="div" sx={{ fontSize: '1.0rem', fontWeight: 600 }}>
            Manufacturing Traceback System
          </Typography>

          {/* Global search (AWS-style) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 440 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pr: 1 }}>
                      <SearchIcon sx={{ color: 'rgba(255,255,255,0.8)' }} />
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    borderRadius: 1,
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.35)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputBase-input': { pl: 0.5 },
                  minWidth: 240,
                }}
              />
            </Box>
          </Box>
          
          {/* Utilities: language, help, notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1, gap: 1 }}>
            <LanguageIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={handleLanguageChange}
                sx={{
                  color: 'white',
                  '& .MuiSelect-icon': {
                    color: 'white',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      '& .MuiMenuItem-root': {
                        fontSize: '0.875rem',
                      },
                    },
                  },
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="th">ไทย</MenuItem>
              </Select>
            </FormControl>
            <IconButton color="inherit" sx={{ ml: 0.5 }} aria-label="help">
              <HelpOutlineIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="notifications">
              <NotificationsNoneIcon />
            </IconButton>
          </Box>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuClick}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              {user.username}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              {t('common.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#f8f9fb',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
              transition: 'width 0.3s ease',
              backgroundColor: '#f8f9fb',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px)` },
          transition: 'width 0.3s ease',
        }}
      >
        <Box sx={{ height: '48px' }} />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 