import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

const pages = [
  { title: 'Home', path: '/', icon: HomeIcon },
  { title: 'Tests', path: '/tests', icon: LibraryBooksIcon },
  { title: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { title: 'Admin', path: '/admin', icon: AdminIcon, adminOnly: true },
];

const authPages = [
  { title: 'Login', path: '/login', icon: LoginIcon },
  { title: 'Register', path: '/register', icon: PersonAddIcon },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Mock isAdmin state - replace with actual auth logic
  const [isAdmin] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const filteredPages = pages.filter(page => !page.adminOnly || (page.adminOnly && isAdmin));

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {filteredPages.map((page) => (
          <ListItem
            button
            key={page.title}
            component={RouterLink}
            to={page.path}
            onClick={handleDrawerToggle}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon>
              <page.icon />
            </ListItemIcon>
            <ListItemText primary={page.title} />
          </ListItem>
        ))}
        {authPages.map((page) => (
          <ListItem
            button
            key={page.title}
            component={RouterLink}
            to={page.path}
            onClick={handleDrawerToggle}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.secondary.light,
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon>
              <page.icon />
            </ListItemIcon>
            <ListItemText primary={page.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'Poppins',
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            Q-Economics
          </Typography>

          {/* Mobile menu button */}
          {isMobile ? (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              {/* Desktop navigation */}
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                {filteredPages.map((page) => (
                  <Button
                    key={page.title}
                    component={RouterLink}
                    to={page.path}
                    sx={{
                      mx: 1,
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                      },
                    }}
                    startIcon={<page.icon />}
                  >
                    {page.title}
                  </Button>
                ))}
              </Box>

              {/* Auth buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {authPages.map((page) => (
                  <Button
                    key={page.title}
                    component={RouterLink}
                    to={page.path}
                    variant={page.title === 'Login' ? 'outlined' : 'contained'}
                    color={page.title === 'Login' ? 'primary' : 'secondary'}
                    startIcon={<page.icon />}
                  >
                    {page.title}
                  </Button>
                ))}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
