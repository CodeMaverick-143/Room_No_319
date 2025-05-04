import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  Button, 
  Paper,
  Card,
  CardContent,
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const ContactPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send this data to your backend
      console.log('Form submitted:', formData);
      
      // Show success message
      setSnackbarOpen(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
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

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Header */}
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
          Contact Us
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
          variants={itemVariants}
        >
          We'd love to hear from you. Get in touch with our team.
        </Typography>
      </MotionBox>

      <Grid container spacing={6}>
        {/* Contact Information */}
        <Grid item xs={12} md={5}>
          <MotionBox
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
              Get In Touch
            </Typography>
            
            <Typography variant="body1" paragraph>
              Have questions about our products or services? Need help with an order? Our customer support team is here to help you.
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                {[
                  { 
                    icon: <LocationOnIcon color="primary" sx={{ fontSize: 40 }} />, 
                    title: 'Our Location', 
                    details: '123 Commerce Street, Bangalore, India 560001' 
                  },
                  { 
                    icon: <PhoneIcon color="primary" sx={{ fontSize: 40 }} />, 
                    title: 'Phone Number', 
                    details: '+91 123 456 7890' 
                  },
                  { 
                    icon: <EmailIcon color="primary" sx={{ fontSize: 40 }} />, 
                    title: 'Email Address', 
                    details: 'support@shop319.com' 
                  },
                  { 
                    icon: <AccessTimeIcon color="primary" sx={{ fontSize: 40 }} />, 
                    title: 'Working Hours', 
                    details: 'Monday - Friday: 9AM - 6PM' 
                  }
                ].map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <MotionBox
                      variants={itemVariants}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: 'primary.main',
                        }
                      }}
                    >
                      <Box sx={{ mr: 3 }}>
                        {item.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.details}
                        </Typography>
                      </Box>
                    </MotionBox>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            {/* Social Media */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, index) => (
                  <Button 
                    key={index} 
                    variant="outlined" 
                    color="primary"
                    sx={{ 
                      borderRadius: 2,
                      minWidth: 'auto',
                      px: 2
                    }}
                  >
                    {social}
                  </Button>
                ))}
              </Box>
            </Box>
          </MotionBox>
        </Grid>
        
        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <MotionPaper
            elevation={3}
            sx={{ p: 4, borderRadius: 4 }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
              Send Us a Message
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!formErrors.subject}
                    helperText={formErrors.subject}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    multiline
                    rows={6}
                    fullWidth
                    required
                    error={!!formErrors.message}
                    helperText={formErrors.message}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </MotionPaper>
        </Grid>
      </Grid>
      
      {/* Map Section */}
      <MotionBox
        sx={{ mt: 10 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Our Location
        </Typography>
        
        <Box
          component="iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9939976457!2d77.59012837484937!3d12.97174651839181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBrigade%20Road%2C%20Bengaluru%2C%20Karnataka%20560001!5e0!3m2!1sen!2sin!4v1682951349023!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0, borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </MotionBox>
      
      {/* FAQ Section */}
      <MotionBox
        sx={{ mt: 10, mb: 6 }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Frequently Asked Questions
        </Typography>
        
        <Grid container spacing={3}>
          {[
            { 
              question: "How can I track my order?", 
              answer: "You can track your order by logging into your account and visiting the 'My Orders' section. Alternatively, you can use the tracking number provided in your shipping confirmation email." 
            },
            { 
              question: "What is your return policy?", 
              answer: "We offer a 30-day return policy for most items. Products must be in their original condition with all tags and packaging intact. Please visit our Returns page for more information." 
            },
            { 
              question: "Do you ship internationally?", 
              answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination. You can see the shipping options available during checkout." 
            },
            { 
              question: "How can I change or cancel my order?", 
              answer: "You can change or cancel your order within 1 hour of placing it by contacting our customer support team. After this time, we may have already begun processing your order for shipment." 
            }
          ].map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <MotionBox
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card sx={{ 
                  height: '100%', 
                  borderRadius: 4,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </MotionBox>
      
      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Thank you for your message! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage;
