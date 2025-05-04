import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton, 
  TextField, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto',
        pt: 6,
        pb: 3
      }}
    >
      <Container maxWidth="lg">
        {/* Order Information Section */}
        <Paper
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 6, 
            bgcolor: theme.palette.success.main, 
            color: 'white',
            borderRadius: 2
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WhatsAppIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Order via WhatsApp
                  </Typography>
                  <Typography variant="body1">
                    Message us at +91 8779239308 to place your order
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Visit Room 319
                  </Typography>
                  <Typography variant="body1">
                    Come to Room 319 to pick up your order
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} justifyContent="center">
            {[
              { icon: <LocalShippingIcon fontSize="large" />, text: 'Fast Delivery' },
              { icon: <PaymentIcon fontSize="large" />, text: 'Secure Payment' },
              { icon: <SupportAgentIcon fontSize="large" />, text: 'Friendly Support' },
              { icon: <SecurityIcon fontSize="large" />, text: 'Quality Products' }
            ].map((feature, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      '& svg': {
                        color: 'primary.main'
                      }
                    }
                  }}
                >
                  <Box sx={{ color: 'text.secondary', mb: 1 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="body2">
                    {feature.text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ mb: 6 }} />

        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* About Column */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Room No.319
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your trusted destination for quality products at amazing prices. We offer a wide range of items with incredible discounts.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton 
                component="a" 
                href="https://wa.me/919341741017" 
                target="_blank" 
                sx={{ 
                  color: '#25D366',
                  mr: 1,
                  '&:hover': {
                    bgcolor: 'rgba(37, 211, 102, 0.1)'
                  }
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <List dense disablePadding>
              {[
                { text: 'Home', path: '/' },
                { text: 'Products', path: '/products' },
                { text: 'About Us', path: '/about' },
                { text: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <ListItem 
                  key={link.text} 
                  disableGutters 
                  sx={{ 
                    pb: 0.5,
                    '& a': {
                      color: 'text.secondary',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        pl: 0.5
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Link component={RouterLink} to={link.path}>
                        {link.text}
                      </Link>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Categories
            </Typography>
            <List dense disablePadding>
              {[
                'Snacks',
                'Beverages',
                'Personal Care',
                'Household'
              ].map((category) => (
                <ListItem 
                  key={category} 
                  disableGutters 
                  sx={{ 
                    pb: 0.5,
                    '& a': {
                      color: 'text.secondary',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                        pl: 0.5
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Link component={RouterLink} to={`/products?category=${category}`}>
                        {category}
                      </Link>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Footer */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: { xs: 2, sm: 0 } }}>
            {currentYear} Room No.319. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              For orders, WhatsApp at +91 8779239308 or visit Room 319
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
