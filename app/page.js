import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import Container from '@mui/material/Container';

const HomePage = () => {
  return (
    <>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: '#000000' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#E0E0E0' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ color: '#B0B0B0', '&:hover': { bgcolor: '#333333' } }}>
              Login
            </Button>
            <Button color="inherit" href="/sign-up" sx={{ color: '#B0B0B0', '&:hover': { bgcolor: '#333333' } }}>
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Main Hero Section */}
      <Box sx={{ textAlign: 'center', my: 4, bgcolor: '#000000', py: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#B0B0B0', mb: 4 }}>
          The easiest way to create and manage flashcards from your text.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#FF5722',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#E64A19' },
              }}
              href="/generate"
            >
              Get Started
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              sx={{
                color: '#FF5722',
                borderColor: '#FF5722',
                '&:hover': { bgcolor: '#FF5722', color: '#FFFFFF' },
              }}
              href="/flashcards"
            >
              Saved Cards
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 6, py: 6, bgcolor: '#1F1F1F' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', color: '#FFFFFF', mb: 4 }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#2C2C2C', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#FF5722' }}>
                  Easy to Use
                </Typography>
                <Typography sx={{ color: '#E0E0E0' }}>
                  Create and manage flashcards effortlessly with our intuitive interface.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#2C2C2C', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#FF5722' }}>
                  Flexible
                </Typography>
                <Typography sx={{ color: '#E0E0E0' }}>
                  Customize your flashcards with various options and settings.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#2C2C2C', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#FF5722' }}>
                  Accessible
                </Typography>
                <Typography sx={{ color: '#E0E0E0' }}>
                  Access your flashcards from anywhere, anytime on any device.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#000000', color: '#E0E0E0', textAlign: 'center' }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Flashcard SaaS. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default HomePage;
