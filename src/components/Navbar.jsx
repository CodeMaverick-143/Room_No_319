import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button, 
  IconButton, 
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  InputBase,
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StoreIcon from '@mui/icons-material/Store';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';

const MotionBox = motion(Box);

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the current route is active
  const isActive = (path) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Navigation links
  const navLinks = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Products', path: '/products', icon: <CategoryIcon /> }
  ];

  // Mobile drawer content
  const drawerContent = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Room No.319
        </Typography>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem 
            button 
            component={Link} 
            to={link.path} 
            key={link.text}
            selected={isActive(link.path)}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive(link.path) ? 'primary.main' : 'inherit',
              minWidth: 40
            }}>
              {link.icon}
            </ListItemIcon>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem 
          button 
          component="a" 
          href="https://wa.me/918779239308" 
          target="_blank"
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <WhatsAppIcon style={{ color: '#25D366' }} />
          </ListItemIcon>
          <ListItemText primary="Order on WhatsApp" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={scrolled ? 4 : 0}
      sx={{ 
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? 0 : 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <MotionBox
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit'
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <StoreIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                mr: 2,
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
              }}
            >
              Room No.319
            </Typography>
          </MotionBox>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.text}
                  component={Link}
                  to={link.path}
                  sx={{
                    mx: 1,
                    color: isActive(link.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(link.path) ? 'bold' : 'medium',
                    position: 'relative',
                    '&::after': isActive(link.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '20%',
                      width: '60%',
                      height: 3,
                      bgcolor: 'primary.main',
                      borderRadius: 3
                    } : {}
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Search and WhatsApp Order Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Search */}
            {searchOpen ? (
              <Box
                component="form"
                onSubmit={handleSearchSubmit}
                sx={{
                  position: 'relative',
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.common.black, 0.05),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.black, 0.1),
                  },
                  mr: 1,
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                <Box sx={{ 
                  padding: theme.spacing(0, 2), 
                  height: '100%', 
                  position: 'absolute', 
                  display: 'flex', 
                  alignItems: 'center'
                }}>
                  <SearchIcon />
                </Box>
                <InputBase
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  sx={{
                    color: 'inherit',
                    '& .MuiInputBase-input': {
                      padding: theme.spacing(1, 1, 1, 0),
                      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                      width: { xs: '100%', sm: '12ch', md: '20ch' },
                    },
                  }}
                />
                <IconButton 
                  size="small" 
                  sx={{ position: 'absolute', right: 0, top: 0, height: '100%' }}
                  onClick={() => setSearchOpen(false)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </IconButton>
            )}

            {/* WhatsApp Order Button - Desktop only */}
            {!isMobile && (
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                component="a"
                href="https://wa.me/919341741017"
                target="_blank"
                sx={{ 
                  ml: 2,
                  bgcolor: '#25D366',
                  '&:hover': {
                    bgcolor: '#128C7E'
                  }
                }}
              >
                Order on WhatsApp
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
