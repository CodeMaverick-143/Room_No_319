import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Divider, 
  IconButton, 
  Paper,
  TextField,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

// Mock cart data - in a real app, this would come from a cart context or state
const initialCartItems = [
  {
    id: 1,
    name: "Oreo",
    image: "https://example.com/images/oreo.jpg",
    originalPrice: 10,
    discountPercentage: 10,
    quantity: 2
  },
  {
    id: 7,
    name: "Alofruit Guava",
    image: "https://example.com/images/alofruit.jpg",
    originalPrice: 40,
    discountPercentage: 5,
    quantity: 1
  },
  {
    id: 13,
    name: "Neem and Turmeric Soap",
    image: "https://example.com/images/neem_turmeric.jpg",
    originalPrice: 64,
    discountPercentage: 6,
    quantity: 1
  }
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const theme = useTheme();

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const discountedPrice = item.originalPrice - (item.originalPrice * item.discountPercentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 5) : 0;
  const discount = promoApplied ? (subtotal * promoDiscount) : 0;
  const total = subtotal + shipping - discount;

  const handleQuantityChange = (id, change) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) } 
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleApplyPromo = () => {
    // Simple promo code logic - in a real app, this would validate against a backend
    if (promoCode.toLowerCase() === 'discount20') {
      setPromoApplied(true);
      setPromoDiscount(0.2); // 20% discount
    } else {
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Your Shopping Cart
      </Typography>
      
      {cartItems.length > 0 ? (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <MotionBox
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Cart Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/products" 
                    color="primary"
                  >
                    Continue Shopping
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                {cartItems.map((item) => {
                  const discountedPrice = item.originalPrice - (item.originalPrice * item.discountPercentage / 100);
                  
                  return (
                    <MotionBox 
                      key={item.id}
                      sx={{ 
                        mb: 3,
                        pb: 3,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:last-child': {
                          mb: 0,
                          pb: 0,
                          borderBottom: 0
                        }
                      }}
                      variants={itemVariants}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3} sm={2}>
                          <Box
                            component="img"
                            src={item.image || `https://placehold.co/100x100?text=${item.name}`}
                            alt={item.name}
                            sx={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: 1,
                              border: 1,
                              borderColor: 'divider'
                            }}
                          />
                        </Grid>
                        <Grid item xs={9} sm={4}>
                          <Typography variant="subtitle1" component={Link} to={`/products/${item.id}`} sx={{ 
                            textDecoration: 'none',
                            color: 'text.primary',
                            fontWeight: 'medium',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}>
                            {item.name}
                          </Typography>
                          {item.discountPercentage > 0 && (
                            <Typography variant="body2" color="error">
                              {item.discountPercentage}% OFF
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                            width: 'fit-content'
                          }}>
                            <IconButton 
                              size="small"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ px: 2 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton 
                              size="small"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                        <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            ₹{(discountedPrice * item.quantity).toFixed(2)}
                          </Typography>
                          {item.discountPercentage > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                              ₹{(item.originalPrice * item.quantity).toFixed(2)}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={2} sm={1} sx={{ textAlign: 'right' }}>
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveItem(item.id)}
                            size="small"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </MotionBox>
                  );
                })}
              </Paper>
              
              {/* Promo Code */}
              <Paper sx={{ p: 3 }} elevation={1}>
                <Typography variant="h6" gutterBottom>
                  Promo Code
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  alignItems: { xs: 'stretch', sm: 'center' }
                }}>
                  <TextField
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ flexGrow: 1 }}
                    helperText={promoApplied ? "Promo code applied successfully!" : "Try 'DISCOUNT20' for 20% off"}
                    FormHelperTextProps={{
                      sx: { color: promoApplied ? 'success.main' : 'text.secondary' }
                    }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleApplyPromo}
                    sx={{ minWidth: 100 }}
                  >
                    Apply
                  </Button>
                </Box>
              </Paper>
            </MotionBox>
          </Grid>
          
          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <MotionPaper 
              sx={{ p: 3, position: 'sticky', top: 20 }} 
              elevation={2}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">₹{subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1">
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </Typography>
                </Box>
                {promoApplied && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" color="error">Discount (20%)</Typography>
                    <Typography variant="body1" color="error">-₹{discount.toFixed(2)}</Typography>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
                sx={{ 
                  py: 1.5,
                  mb: 3,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 4
                  }
                }}
              >
                Proceed to Checkout
              </Button>
              
              {/* Trust badges */}
              <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                        <LocalShippingIcon color="primary" />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Free Shipping
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                        <PaymentIcon color="primary" />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Secure Payment
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                        <SecurityIcon color="primary" />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Money Back Guarantee
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </MotionPaper>
          </Grid>
        </Grid>
      ) : (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            textAlign: 'center', 
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
            Looks like you haven't added any products to your cart yet.
            Browse our products and discover amazing deals!
          </Typography>
          <Button 
            component={Link} 
            to="/products" 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              fontWeight: 'bold'
            }}
          >
            Start Shopping
          </Button>
        </MotionBox>
      )}
    </Container>
  );
};

export default CartPage;
