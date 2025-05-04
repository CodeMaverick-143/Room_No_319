import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const ProductCard = ({ product }) => {
  const theme = useTheme();
  
  // Calculate discounted price
  const discountedPrice = product.originalPrice - (product.originalPrice * product.discountPercentage / 100);
  
  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const message = `Hi, I would like to order: ${product.name} (₹${discountedPrice.toFixed(2)})`;
    window.open(`https://wa.me/918779239308?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          width: '100%',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 15px 12px rgba(0,0,0,0.22)',
            '& .product-image': {
              transform: 'scale(1.1)',
            },
          },
        }} 
        className="product-card"
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', height: { xs: 140, sm: 160, md: 180 } }}>
          <CardMedia
            component="img"
            height="100%"
            image={product.image || "https://placehold.co/300x200?text=Product+Image"}
            alt={product.name}
            className="product-image"
            sx={{ 
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.95)',
              width: '100%',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
              }
            }}
          />
          {product.discountPercentage > 0 && (
            <Box 
              className="discount-badge"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                color: 'white',
                fontWeight: 'bold',
                py: 0.5,
                px: 1.5,
                borderRadius: '20px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                zIndex: 1,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <LocalOfferIcon sx={{ fontSize: '0.9rem' }} />
              {product.discountPercentage}% OFF
            </Box>
          )}
        </Box>
        <CardContent sx={{ 
          flexGrow: 1, 
          p: { xs: 1.5, sm: 2, md: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          height: { xs: '220px', sm: '230px', md: '240px' },
        }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              lineHeight: 1.3,
              height: { xs: '2.4rem', sm: '2.6rem', md: '2.8rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: theme.palette.text.primary,
              letterSpacing: '0.01em',
            }}
          >
            {product.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              height: { xs: '2.4rem', sm: '2.6rem', md: '3rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              opacity: 0.8,
              letterSpacing: '0.01em',
            }}
          >
            {product.description}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1.5,
            mt: 'auto',
            background: 'rgba(0,0,0,0.1)',
            p: 1,
            borderRadius: 1,
          }}>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ 
                fontWeight: 'bold', 
                mr: 1,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                textShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
              }}
            >
              ₹{discountedPrice.toFixed(2)}
            </Typography>
            {product.discountPercentage > 0 && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  textDecoration: 'line-through',
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                  opacity: 0.6,
                }}
              >
                ₹{product.originalPrice.toFixed(2)}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ height: '28px', mb: 2 }}>
            {product.Quantity !== undefined && (
              <>
                {product.Quantity <= 5 && product.Quantity > 0 && (
                  <Chip 
                    label={`Only ${product.Quantity} left`} 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      background: 'rgba(245, 158, 11, 0.1)',
                    }}
                  />
                )}
                {product.Quantity === 0 && (
                  <Chip 
                    label="Out of stock" 
                    size="small" 
                    color="error" 
                    variant="outlined"
                    sx={{ 
                      fontSize: '0.7rem',
                      borderRadius: '4px',
                      background: 'rgba(239, 68, 68, 0.1)',
                    }}
                  />
                )}
              </>
            )}
          </Box>
          
          <Button
            variant="contained"
            color="success"
            fullWidth
            startIcon={<WhatsAppIcon />}
            onClick={handleWhatsAppOrder}
            size="small"
            sx={{ 
              mt: 'auto', 
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
              py: { xs: 0.5, sm: 0.75, md: 1 },
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
                boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Order Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
