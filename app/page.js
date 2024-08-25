import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';

const HomePage = () => {
  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#000000' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#FFFFF0' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ color: '#C0C0C0' }}>
              Login
            </Button>
            <Button color="inherit" href="/sign-up" sx={{ color: '#C0C0C0' }}>
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: 'center', my: 4, bgcolor: '#000000', py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#FFFFF0' }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#C0C0C0' }}>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, mr: 2, bgcolor: '#FF0000', color: '#FFFFF0', '&:hover': { bgcolor: '#C0C0C0', color: '#000000' } }}
          href="/generate"
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          sx={{ mt: 2, color: '#FF0000', borderColor: '#FF0000', '&:hover': { bgcolor: '#FF0000', color: '#FFFFF0' } }}
          href="/flashcards" // Updated to link to the flashcards page
        >
          Saved Cards
        </Button>
      </Box>
      <Box sx={{ my: 6, bgcolor: '#000000', py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#FFFFF0', textAlign: 'center' }}>
          Features
        </Typography>
        <Grid container spacing={4} sx={{ color: '#C0C0C0' }}>
          {/* Feature items */}
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: 'center', bgcolor: '#000000', py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#FFFFF0' }}>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ color: '#FFFFF0' }}>
          {/* Pricing plans */}
        </Grid>
      </Box>
    </>
  );
};

export default HomePage;
