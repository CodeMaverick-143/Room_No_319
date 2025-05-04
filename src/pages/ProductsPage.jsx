import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Divider,
  Chip,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Pagination,
  Paper,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionPaper = motion(Paper);

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        setProducts(response.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...products];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.originalPrice >= priceRange[0] && 
      product.originalPrice <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.originalPrice - b.originalPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.originalPrice - a.originalPrice);
        break;
      case 'discount':
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        // Default sorting (by id)
        result.sort((a, b) => a.id - b.id);
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1); // Reset to first page on category change
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('default');
    setPriceRange([0, 1000]);
    setPage(1);
  };

  // Calculate pagination
  const indexOfLastProduct = page * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography color="error" variant="h5">{error}</Typography>
      </Box>
    );
  }

  const filterDrawer = (
    <Box
      sx={{ width: isMobile ? '100vw' : 300, p: 3 }}
      role="presentation"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Filters
        </Typography>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="discount">Highest Discount</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Chip 
            label="Clear All Filters" 
            onClick={clearFilters} 
            color="primary" 
            variant="outlined"
            sx={{ px: 2 }}
          />
        </Box>
      </Box>
    </Box>
  );

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
            fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' },
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
          <WhatsAppIcon fontSize={isSmall ? 'small' : 'medium'} />
        </IconButton>
      </Alert>
      
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        {/* Page Header */}
        <Box sx={{ mb: { xs: 3, sm: 4, md: 6 }, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
            }}
          >
            Our Products
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto',
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
              opacity: 0.8
            }}
          >
            Browse our collection of high-quality products at amazing prices with special discounts
          </Typography>
        </Box>
        
        {/* WhatsApp Order Information */}
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={3}
          sx={{ 
            p: { xs: 2, sm: 2.5, md: 3 }, 
            borderRadius: 2, 
            background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.9) 0%, rgba(18, 140, 126, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 2 },
            mb: { xs: 2, sm: 3, md: 4 },
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
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
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'medium',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              textAlign: { xs: 'center', md: 'left' },
              position: 'relative',
              zIndex: 1,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }}
          >
            Order easily via WhatsApp or visit Room No.319
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
            <IconButton 
              color="inherit" 
              component="a" 
              href="https://wa.me/918779239308" 
              target="_blank"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.1)'
                },
                p: { xs: 1, sm: 1.25, md: 1.5 },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
              }}
            >
              <WhatsAppIcon fontSize={isSmall ? 'medium' : 'large'} />
            </IconButton>
          </Box>
          
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0
            }}
          />
        </MotionPaper>
        
        {/* Search and Filter Bar */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          mb: { xs: 2, sm: 3, md: 4 },
          gap: { xs: 1, sm: 2 },
          background: 'linear-gradient(145deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.4) 100%)',
          backdropFilter: 'blur(10px)',
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <TextField
            placeholder="Search products..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ 
              maxWidth: { md: '60%' },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                background: 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize={isSmall ? 'small' : 'medium'} sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: 'row' },
            justifyContent: { xs: 'space-between' }
          }}>
            <FormControl sx={{ minWidth: { xs: 120, sm: 150 } }}>
              <InputLabel id="sort-label" sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' } }}>
                Sort By
              </InputLabel>
              <Select
                labelId="sort-label"
                id="sort"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
                size={isSmall ? "small" : "medium"}
                sx={{ 
                  '& .MuiSelect-select': {
                    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
                  },
                  borderRadius: 1.5,
                  background: 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="discount">Highest Discount</MenuItem>
              </Select>
            </FormControl>
            
            <IconButton 
              color="primary" 
              onClick={toggleDrawer(true)}
              size={isSmall ? "small" : "medium"}
              sx={{ 
                border: 1, 
                borderColor: 'divider',
                borderRadius: 1.5,
                p: { xs: 0.75, sm: 1 },
                background: 'rgba(139, 92, 246, 0.1)',
                '&:hover': {
                  background: 'rgba(139, 92, 246, 0.2)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <FilterListIcon fontSize={isSmall ? 'small' : 'medium'} />
            </IconButton>
          </Box>
        </Box>
        
        {/* Active Filters */}
        {(selectedCategory || searchTerm) && (
          <Box sx={{ display: 'flex', gap: 1, mb: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
            {selectedCategory && (
              <Chip 
                label={`Category: ${selectedCategory}`} 
                onDelete={() => setSelectedCategory('')}
                color="primary"
                variant="outlined"
                size={isSmall ? "small" : "medium"}
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '8px',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)'
                  }
                }}
              />
            )}
            {searchTerm && (
              <Chip 
                label={`Search: ${searchTerm}`} 
                onDelete={() => setSearchTerm('')}
                color="primary"
                variant="outlined"
                size={isSmall ? "small" : "medium"}
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '8px',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.2)'
                  }
                }}
              />
            )}
            <Chip 
              label="Clear All" 
              onClick={clearFilters}
              color="secondary"
              size="small"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                background: 'rgba(236, 72, 153, 0.1)',
                borderRadius: '8px',
                '&:hover': {
                  background: 'rgba(236, 72, 153, 0.2)'
                }
              }}
            />
          </Box>
        )}
        
        {/* Results Summary */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}
          >
            Showing {currentProducts.length} of {filteredProducts.length} products
          </Typography>
        </Box>
        
        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <MotionGrid 
            container 
            spacing={{ xs: 2, sm: 2, md: 3 }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{ 
              '& .MuiGrid-item': {
                display: 'flex',
                height: { xs: '400px', sm: '430px', md: '460px' }
              }
            }}
          >
            {currentProducts.map((product) => (
              <Grid item key={product.id} xs={6} sm={6} md={4}>
                <MotionBox
                  variants={itemVariants}
                  sx={{ width: '100%', height: '100%' }}
                >
                  <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', width: '100%', height: '100%', display: 'block' }}>
                    <ProductCard product={product} />
                  </Link>
                </MotionBox>
              </Grid>
            ))}
          </MotionGrid>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 4, sm: 6, md: 8 },
            background: 'linear-gradient(145deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.4) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            p: 4,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              No products found
            </Typography>
            <Typography 
              variant="body1"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
        
        {/* Pagination */}
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, sm: 5, md: 6 } }}>
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size={isSmall ? "medium" : "large"}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  color: theme.palette.text.primary,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    color: 'white',
                    boxShadow: '0 4px 8px rgba(139, 92, 246, 0.3)',
                  },
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.1)'
                  }
                }
              }}
            />
          </Box>
        )}
        
        {/* Filter Drawer */}
        <Drawer
          anchor={isMobile ? 'bottom' : 'right'}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? '16px 16px 0 0' : 0,
              maxHeight: isMobile ? '80vh' : '100vh',
              background: 'linear-gradient(145deg, #1F2937 0%, #111827 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
            }
          }}
        >
          {filterDrawer}
        </Drawer>
      </Container>
    </>
  );
};

export default ProductsPage;
