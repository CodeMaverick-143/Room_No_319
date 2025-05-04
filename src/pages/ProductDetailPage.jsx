import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Button, 
  Divider, 
  CircularProgress,
  Breadcrumbs,
  Rating,
  Chip,
  Paper,
  Tabs,
  Tab,
  useTheme,
  Alert,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);
        
        // Fetch related products from the same category
        const allProductsResponse = await axios.get('http://localhost:3001/products');
        const related = allProductsResponse.data
          .filter(p => p.category === response.data.category && p.id !== parseInt(id))
          .slice(0, 3);
        setRelatedProducts(related);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
    // Scroll to top when component mounts or id changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.Quantity || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Hi, I would like to order: ${product.name} (₹${discountedPrice.toFixed(2)}) - Quantity: ${quantity}`;
    window.open(`https://wa.me/918779239308?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return originalPrice - (originalPrice * discountPercentage / 100);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography color="error" variant="h5" gutterBottom>
            {error || 'Product not found'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/products')}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.originalPrice, product.discountPercentage);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Order Information Alert */}
      <Alert 
        severity="info" 
        variant="outlined"
        icon={<WhatsAppIcon style={{ color: theme.palette.success.main }} />}
        sx={{ 
          mb: { xs: 2, sm: 3, md: 4 },
          borderColor: theme.palette.success.main,
          color: theme.palette.success.main,
          '& .MuiAlert-message': {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' }
          }
        }}
      >
        For orders, WhatsApp at +91 8779239308 or visit Room No.319 to get your order
      </Alert>
      
      {/* Breadcrumbs */}
      <Breadcrumbs 
        sx={{ 
          mb: { xs: 2, sm: 3, md: 4 },
          '& .MuiBreadcrumbs-li': {
            fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' }
          }
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Link to="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          Products
        </Link>
        <Typography 
          color="text.primary"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}
        >
          {product.name}
        </Typography>
      </Breadcrumbs>
      
      <MotionGrid 
        container 
        spacing={{ xs: 2, sm: 3, md: 4 }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <MotionBox
            variants={itemVariants}
            sx={{ position: 'relative' }}
          >
            <Box
              component="img"
              src={product.image || "https://placehold.co/600x400?text=Product+Image"}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 2,
                mb: 2,
                objectFit: 'contain',
                aspectRatio: '1/1'
              }}
            />
            {product.discountPercentage > 0 && (
              <Chip
                label={`${product.discountPercentage}% OFF`}
                color="error"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontWeight: 'bold',
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  py: { xs: 1, sm: 1.5, md: 2 }
                }}
              />
            )}
          </MotionBox>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <MotionBox variants={itemVariants}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
              }}
            >
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={4.5} precision={0.5} readOnly size={isSmall ? 'small' : 'medium'} />
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 1,
                  fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' }
                }}
              >
                (24 reviews)
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ 
                mb: 3,
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
              }}
            >
              {product.description}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
              <Typography 
                variant="h4" 
                color="primary" 
                sx={{ 
                  fontWeight: 'bold', 
                  mr: 2,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}
              >
                ₹{discountedPrice.toFixed(2)}
              </Typography>
              {product.discountPercentage > 0 && (
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    textDecoration: 'line-through',
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                  }}
                >
                  ₹{product.originalPrice.toFixed(2)}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mr: 3,
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
                }}
              >
                Quantity:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <Button 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  sx={{ 
                    minWidth: { xs: '30px', sm: '35px', md: '40px' }, 
                    borderRadius: 0,
                    p: { xs: 0.5, sm: 0.75, md: 1 }
                  }}
                >
                  -
                </Button>
                <Typography 
                  sx={{ 
                    px: { xs: 1, sm: 1.5, md: 2 },
                    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
                  }}
                >
                  {quantity}
                </Typography>
                <Button 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.Quantity || 10)}
                  sx={{ 
                    minWidth: { xs: '30px', sm: '35px', md: '40px' }, 
                    borderRadius: 0,
                    p: { xs: 0.5, sm: 0.75, md: 1 }
                  }}
                >
                  +
                </Button>
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  ml: 2,
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                }}
              >
                {product.Quantity > 0 ? `${product.Quantity} available` : 'Out of stock'}
              </Typography>
            </Box>
            
            {/* Order Options */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5, md: 2 }, mb: 4 }}>
              <Button
                variant="contained"
                color="success"
                size={isSmall ? "medium" : "large"}
                startIcon={<WhatsAppIcon />}
                onClick={handleWhatsAppOrder}
                disabled={product.Quantity <= 0}
                fullWidth
                sx={{ 
                  py: { xs: 1, sm: 1.25, md: 1.5 },
                  fontWeight: 'bold',
                  bgcolor: '#25D366',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: '#128C7E',
                    transform: 'translateY(-3px)',
                    boxShadow: 4
                  }
                }}
              >
                Order via WhatsApp
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size={isSmall ? "medium" : "large"}
                startIcon={<LocationOnIcon />}
                component="a"
                href="https://wa.me/918779239308"
                target="_blank"
                fullWidth
                sx={{ 
                  py: { xs: 1, sm: 1.25, md: 1.5 },
                  fontWeight: 'bold',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 2
                  }
                }}
              >
                Visit Room No.319
              </Button>
              
              <Button 
                variant="text" 
                color="primary" 
                startIcon={<ShareIcon />}
                sx={{ 
                  alignSelf: 'center', 
                  mt: 1,
                  fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
                }}
              >
                Share Product
              </Button>
            </Box>
            
            {/* Product Metadata */}
            <Box sx={{ 
              bgcolor: 'background.paper', 
              p: { xs: 1.5, sm: 1.75, md: 2 }, 
              borderRadius: 1,
              border: 1,
              borderColor: 'divider'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                }}
              >
                <strong>Category:</strong> {product.category}
              </Typography>
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}
              >
                <strong>SKU:</strong> PROD-{product.id.toString().padStart(4, '0')}
              </Typography>
            </Box>
          </MotionBox>
        </Grid>
      </MotionGrid>
      
      {/* Product Details Tabs */}
      <MotionPaper 
        elevation={0} 
        sx={{ 
          mt: { xs: 4, sm: 5, md: 6 }, 
          mb: { xs: 3, sm: 3.5, md: 4 }, 
          border: 1, 
          borderColor: 'divider' 
        }}
        variants={itemVariants}
      >
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' }
            }
          }}
        >
          <Tab label="Description" id="tab-0" />
          <Tab label="Specifications" id="tab-1" />
          <Tab label="Reviews" id="tab-2" />
        </Tabs>
        
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          {tabValue === 0 && (
            <Typography 
              variant="body1"
              sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' } }}
            >
              {product.description}
              <br /><br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
              Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget 
              aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, 
              nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
            </Typography>
          )}
          {tabValue === 1 && (
            <Box>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
                }}
              >
                Product Specifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    <strong>Brand:</strong> Premium Brand
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    <strong>Weight:</strong> 0.5 kg
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    <strong>Dimensions:</strong> 10 x 5 x 2 cm
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    <strong>Material:</strong> High Quality
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    <strong>Country of Origin:</strong> India
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    <strong>Warranty:</strong> 1 Year
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          {tabValue === 2 && (
            <Box>
              <Typography 
                variant="body1" 
                paragraph
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
                }}
              >
                Customer Reviews
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mr: 2,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                  }}
                >
                  4.5
                </Typography>
                <Box>
                  <Rating value={4.5} precision={0.5} readOnly size={isSmall ? 'small' : 'medium'} />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}
                  >
                    Based on 24 reviews
                  </Typography>
                </Box>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' } }}
              >
                No reviews yet. Be the first to review this product.
              </Typography>
            </Box>
          )}
        </Box>
      </MotionPaper>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: { xs: 5, sm: 6, md: 8 } }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
            }}
          >
            Related Products
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item key={relatedProduct.id} xs={6} sm={6} md={4}>
                <MotionBox
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link to={`/products/${relatedProduct.id}`} style={{ textDecoration: 'none' }}>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: 4
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={relatedProduct.image || "https://placehold.co/300x200?text=Product+Image"}
                        alt={relatedProduct.name}
                        sx={{
                          width: '100%',
                          height: { xs: 120, sm: 150, md: 200 },
                          objectFit: 'cover'
                        }}
                      />
                      <Box sx={{ p: { xs: 1.5, sm: 1.75, md: 2 } }}>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                            fontWeight: 'medium',
                            height: { xs: '2.7rem', sm: '3rem', md: '3.3rem' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {relatedProduct.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            variant="body1" 
                            color="primary" 
                            sx={{ 
                              fontWeight: 'bold', 
                              mr: 1,
                              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                            }}
                          >
                            ₹{calculateDiscountedPrice(relatedProduct.originalPrice, relatedProduct.discountPercentage).toFixed(2)}
                          </Typography>
                          {relatedProduct.discountPercentage > 0 && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                textDecoration: 'line-through',
                                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                              }}
                            >
                              ₹{relatedProduct.originalPrice.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Link>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Back to Products Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, sm: 5, md: 6 } }}>
        <Button 
          variant="outlined" 
          color="primary" 
          component={Link} 
          to="/products"
          startIcon={<ArrowBackIcon />}
          size={isSmall ? "medium" : "large"}
          sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' } }}
        >
          Back to Products
        </Button>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
