import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const NotFoundPage = () => {
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
    <Container maxWidth="md" sx={{ py: 8 }}>
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        sx={{ 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            borderRadius: 4,
            width: '100%',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          <MotionBox variants={itemVariants}>
            <SentimentDissatisfiedIcon 
              sx={{ 
                fontSize: 100, 
                color: 'primary.main',
                mb: 3
              }} 
            />
          </MotionBox>
          
          <MotionTypography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
            variants={itemVariants}
          >
            404
          </MotionTypography>
          
          <MotionTypography 
            variant="h4" 
            gutterBottom
            variants={itemVariants}
          >
            Page Not Found
          </MotionTypography>
          
          <MotionTypography 
            variant="body1" 
            color="text.secondary"
            paragraph
            sx={{ mb: 4, maxWidth: 450, mx: 'auto' }}
            variants={itemVariants}
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </MotionTypography>
          
          <MotionBox 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              gap: 2
            }}
            variants={itemVariants}
          >
            <Button 
              component={Link} 
              to="/" 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                minWidth: 150
              }}
            >
              Go Home
            </Button>
            
            <Button 
              component={Link} 
              to="/products" 
              variant="outlined" 
              color="primary"
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                minWidth: 150
              }}
            >
              Browse Products
            </Button>
          </MotionBox>
        </Paper>
      </MotionBox>
    </Container>
  );
};

export default NotFoundPage;
