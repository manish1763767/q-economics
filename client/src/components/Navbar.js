import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
  Tooltip,
  Badge,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  LibraryBooks as LibraryBooksIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const pages = [
  { title: 'Home', path: '/', icon: HomeIcon },
  { title: 'Tests', path: '/tests', icon: LibraryBooksIcon },
  { title: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
];

const authPages = [
  { title: 'Login', path: '/login', icon: LoginIcon },
  { title: 'Register', path: '/register', icon: PersonAddIcon },
];

const userMenuItems = [
  { title: 'Profile', icon: AccountCircleIcon, path: '/profile' },
  { title: 'Settings', icon: SettingsIcon, path: '/settings' },
  { title: 'Logout', icon: LogoutIcon, path: '/logout' },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  // Mock states - replace with actual auth logic
  const [isAuthenticated] = useState(false);
  const [isAdmin] = useState(true);
  const [notifications] = useState(3);

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

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40,
          }}
        >
          Q
        </Avatar>
        <Typography variant="h6" noWrap component="div" fontWeight="600">
          Q-Economics
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {filteredPages.map((page) => (
          <ListItem
            button
            key={page.title}
            component={RouterLink}
            to={page.path}
            onClick={handleDrawerToggle}
            selected={isActivePath(page.path)}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: `${theme.palette.primary.main}15`,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
                '& .MuiListItemText-primary': {
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                },
              },
              '&:hover': {
                bgcolor: `${theme.palette.primary.main}10`,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActivePath(page.path)
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
            >
              <page.icon />
            </ListItemIcon>
            <ListItemText
              primary={page.title}
              primaryTypographyProps={{
                fontWeight: isActivePath(page.path) ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
        
        {!isAuthenticated && (
          <>
            <Divider sx={{ my: 2 }} />
            {authPages.map((page) => (
              <ListItem
                button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleDrawerToggle}
                selected={isActivePath(page.path)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: `${theme.palette.secondary.main}15`,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.secondary.main,
                    },
                    '& .MuiListItemText-primary': {
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    bgcolor: `${theme.palette.secondary.main}10`,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActivePath(page.path)
                      ? theme.palette.secondary.main
                      : theme.palette.text.secondary,
                  }}
                >
                  <page.icon />
                </ListItemIcon>
                <ListItemText
                  primary={page.title}
                  primaryTypographyProps={{
                    fontWeight: isActivePath(page.path) ? 600 : 400,
                  }}
                />
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 60, md: 64 } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: { xs: 35, md: 40 },
                  height: { xs: 35, md: 40 },
                  mr: 1,
                }}
              >
                Q
              </Avatar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Q-Economics
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {filteredPages.map((page) => (
                <Button
                  key={page.title}
                  component={RouterLink}
                  to={page.path}
                  sx={{
                    mx: 0.5,
                    px: 2,
                    color: isActivePath(page.path)
                      ? theme.palette.primary.main
                      : 'text.secondary',
                    fontWeight: isActivePath(page.path) ? 600 : 400,
                    '&:hover': {
                      bgcolor: `${theme.palette.primary.main}10`,
                    },
                  }}
                  startIcon={<page.icon />}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Notifications">
                    <IconButton
                      size="large"
                      color="inherit"
                      sx={{ color: 'text.secondary' }}
                    >
                      <Badge badgeContent={notifications} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                      <Avatar
                        alt="User Avatar"
                        src="/static/images/avatar/2.jpg"
                        sx={{ width: 35, height: 35 }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {userMenuItems.map((item) => (
                      <MenuItem
                        key={item.title}
                        onClick={handleCloseUserMenu}
                        component={RouterLink}
                        to={item.path}
                        sx={{
                          py: 1,
                          px: 2.5,
                          '&:hover': {
                            bgcolor: `${theme.palette.primary.main}10`,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <item.icon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="body2">{item.title}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    color="primary"
                    sx={{
                      px: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{
                      px: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Add toolbar spacing */}
      <Toolbar sx={{ minHeight: { xs: 60, md: 64 } }} />
    </>
  );
}

export default Navbar;
