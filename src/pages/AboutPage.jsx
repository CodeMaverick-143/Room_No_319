import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Divider,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

const AboutPage = () => {
  const theme = useTheme();

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

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        sx={{ textAlign: 'center', mb: 8 }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: 'bold' }}
          variants={itemVariants}
        >
          About SHOP319
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
          variants={itemVariants}
        >
          Your trusted destination for quality products at amazing prices
        </Typography>
        <Divider sx={{ mb: 6 }} />
      </MotionBox>

      {/* Our Story */}
      <MotionGrid 
        container 
        spacing={6} 
        alignItems="center" 
        sx={{ mb: 10 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <Grid item xs={12} md={6}>
          <MotionBox
            component="img"
            src="https://placehold.co/600x400?text=Our+Story"
            alt="Our Story"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 4,
              boxShadow: 4
            }}
            variants={itemVariants}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MotionBox variants={itemVariants}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Founded in 2020, SHOP319 began with a simple mission: to provide customers with high-quality products at affordable prices. What started as a small online store has grown into a trusted e-commerce platform serving thousands of satisfied customers.
            </Typography>
            <Typography variant="body1" paragraph>
              We believe that shopping should be a delightful experience. That's why we carefully curate our product selection, ensuring that each item meets our high standards for quality and value. Our team works tirelessly to source products that not only meet but exceed your expectations.
            </Typography>
            <Typography variant="body1">
              At SHOP319, we're not just selling products; we're building relationships. We value each customer and strive to provide exceptional service that keeps you coming back. Your satisfaction is our top priority, and we're committed to making your shopping experience seamless and enjoyable.
            </Typography>
          </MotionBox>
        </Grid>
      </MotionGrid>

      {/* Our Values */}
      <MotionBox
        sx={{ mb: 10, textAlign: 'center' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Our Values
        </Typography>
        
        <Grid container spacing={4}>
          {[
            { 
              icon: <StoreIcon sx={{ fontSize: 50 }} />, 
              title: 'Quality Products', 
              description: 'We carefully select each product to ensure it meets our high standards for quality and value.' 
            },
            { 
              icon: <LocalShippingIcon sx={{ fontSize: 50 }} />, 
              title: 'Fast Delivery', 
              description: 'We partner with reliable shipping providers to ensure your orders arrive quickly and safely.' 
            },
            { 
              icon: <SupportAgentIcon sx={{ fontSize: 50 }} />, 
              title: 'Customer Support', 
              description: 'Our dedicated support team is always ready to assist you with any questions or concerns.' 
            },
            { 
              icon: <SecurityIcon sx={{ fontSize: 50 }} />, 
              title: 'Secure Shopping', 
              description: 'Your security is our priority. We use the latest technology to protect your personal information.' 
            }
          ].map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionBox
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                    <Box sx={{ 
                      color: 'primary.main',
                      mb: 2
                    }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* Our Team */}
      <MotionBox
        sx={{ mb: 10 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center' }}>
          Meet Our Team
        </Typography>
        
        <Grid container spacing={4}>
          {[
            { name: 'Rahul Sharma', role: 'Founder & CEO', avatar: 'https://placehold.co/200x200?text=RS' },
            { name: 'Priya Patel', role: 'Head of Operations', avatar: 'https://placehold.co/200x200?text=PP' },
            { name: 'Amit Kumar', role: 'Product Manager', avatar: 'https://placehold.co/200x200?text=AK' },
            { name: 'Neha Singh', role: 'Customer Support Lead', avatar: 'https://placehold.co/200x200?text=NS' }
          ].map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionBox
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card sx={{ 
                  textAlign: 'center', 
                  height: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 6
                  }
                }}>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto', 
                      mt: 3,
                      mb: 2,
                      boxShadow: 2
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* Testimonials */}
      <MotionBox
        sx={{ mb: 6 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 6, textAlign: 'center' }}>
          What Our Customers Say
        </Typography>
        
        <Grid container spacing={4}>
          {[
            { 
              quote: "I've been shopping with SHOP319 for over a year now, and I'm always impressed by the quality of their products and the speed of delivery. Highly recommended!", 
              author: "Ananya Desai",
              location: "Mumbai"
            },
            { 
              quote: "The customer service at SHOP319 is exceptional. They went above and beyond to help me with a return. I'll definitely be a repeat customer.", 
              author: "Vikram Mehta",
              location: "Delhi"
            },
            { 
              quote: "I love the variety of products available at SHOP319. The prices are competitive, and the quality is always top-notch.", 
              author: "Sanjana Reddy",
              location: "Bangalore"
            }
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MotionBox
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 4,
                  boxShadow: 2,
                  position: 'relative',
                  pt: 2,
                  '&:hover': {
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ pb: 4 }}>
                    <Typography variant="body1" paragraph sx={{ 
                      fontStyle: 'italic',
                      position: 'relative',
                      '&:before': {
                        content: '"""',
                        fontSize: '4rem',
                        color: 'rgba(0, 0, 0, 0.1)',
                        position: 'absolute',
                        top: -20,
                        left: -10
                      }
                    }}>
                      {testimonial.quote}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                        {testimonial.author.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {testimonial.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.location}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </MotionBox>
    </Container>
  );
};

export default AboutPage;
