import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Card, 
  CardMedia, 
  CardContent,
  Divider,
  Paper,
  useTheme,
  Alert,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ProductCard from '../components/ProductCard';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);
const MotionPaper = motion(Paper);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        // Get 6 random products as featured
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  return (
    <>
      {/* Order Information Alert */}
      <Alert 
        severity="info" 
        variant="filled"
        icon={<WhatsAppIcon />}
        sx={{ 
          borderRadius: 0,
          py: 1.5,
          background: 'linear-gradient(90deg, rgba(37,211,102,0.9) 0%, rgba(18,140,126,0.9) 100%)',
          backdropFilter: 'blur(10px)',
          '& .MuiAlert-message': {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: { xs: '0.8rem', sm: '1rem' },
            fontWeight: 500
          }
        }}
      >
        For orders, WhatsApp at +91 8779239308 or visit Room No.319 to get your order
        <IconButton 
          color="inherit" 
          size="small" 
          component="a" 
          href="https://wa.me/918779239308" 
          target="_blank"
          sx={{ 
            ml: 2, 
            bgcolor: 'rgba(255,255,255,0.2)', 
            '&:hover': { 
              bgcolor: 'rgba(255,255,255,0.3)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Alert>

      {/* WhatsApp Order Information */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <MotionPaper
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInVariants}
          elevation={3}
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.9) 0%, rgba(18, 140, 126, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
              backgroundRepeat: 'repeat',
              opacity: 0.05,
              zIndex: 0
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
            <WhatsAppIcon sx={{ 
              fontSize: { xs: 30, md: 40 },
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
            }} />
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                mb: 0.5,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}>
                Order via WhatsApp
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Message us at +91 8779239308 to place your order
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
            <LocationOnIcon sx={{ 
              fontSize: { xs: 30, md: 40 },
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
            }} />
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                mb: 0.5,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}>
                Visit Room No.319
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Come to Room No.319 to pick up your order
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<WhatsAppIcon />}
            component="a"
            href="https://wa.me/918779239308"
            target="_blank"
            sx={{ 
              bgcolor: 'white', 
              color: theme.palette.success.main,
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
              fontWeight: 'bold',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Order Now
          </Button>
          
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -40,
              left: -40,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0
            }}
          />
        </MotionPaper>
      </Container>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInVariants}
        >
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: 2, 
              fontWeight: 700,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            Featured Products
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="text.secondary"
            sx={{ 
              mb: 6, 
              maxWidth: 700, 
              mx: 'auto',
              fontSize: { xs: '0.9rem', md: '1rem' },
              opacity: 0.8
            }}
          >
            Explore our selection of high-quality products at amazing prices
          </Typography>
          
          <Grid container spacing={3}>
            <AnimatePresence>
              {featuredProducts.map((product, index) => (
                <Grid item key={product.id} xs={6} sm={6} md={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                  >
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                      <ProductCard product={product} />
                    </Link>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button 
              component={Link} 
              to="/products" 
              variant="contained" 
              color="primary"
              startIcon={<ShoppingBagIcon />}
              size="large"
              sx={{ 
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.5 },
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 25px rgba(139, 92, 246, 0.4)',
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              Shop All Products
            </Button>
          </Box>
        </MotionBox>
      </Container>
    </>
  );
};

export default HomePage;
