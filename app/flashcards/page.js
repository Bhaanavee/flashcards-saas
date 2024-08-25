'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, CircularProgress, Alert, Modal, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useUser } from '@clerk/nextjs';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722', // Bright Red-Orange for primary actions like buttons
    },
    secondary: {
      main: '#E0E0E0', // Light Gray for secondary elements
    },
    background: {
      default: '#000000', // Black for the primary background
      paper: '#1F1F1F', // Very Dark Gray for card backgrounds and modal
    },
    text: {
      primary: '#FFFFFF', // White for primary text
      secondary: '#B0B0B0', // Mid Gray for secondary text
    },
    action: {
      hover: '#2C2C2C', // Dark Gray for hover effects
    },
  },
});

export default function Flashcard() {
  const { user } = useUser();
  const [savedFlashcardSets, setSavedFlashcardSets] = useState([]);
  const [selectedFlashcards, setSelectedFlashcards] = useState([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [flippedStates, setFlippedStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchSavedFlashcardSets = async () => {
      setLoading(true);
      setError('');
      try {
        const userDocRef = doc(db, 'users', user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setSavedFlashcardSets(userData.flashcardSets || []);
        } else {
          setSavedFlashcardSets([]);
        }
      } catch (err) {
        setError('Failed to load saved flashcard sets');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFlashcardSets();
  }, [user]);

  const handleSetClick = async (setName) => {
    setLoading(true);
    setError('');
    try {
      const userDocRef = doc(db, 'users', user.id);
      const flashcardsRef = doc(userDocRef, 'flashcardSets', setName);
      const flashcardsSnap = await getDoc(flashcardsRef);

      if (flashcardsSnap.exists()) {
        const data = flashcardsSnap.data();
        setSelectedFlashcards(data.flashcards || []);
        setSelectedSet(setName);
        setFlippedStates(Array((data.flashcards || []).length).fill(false)); // Initialize flipped states for saved flashcards
        setOpenModal(true);
      } else {
        setError('No flashcards found for this set.');
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setError('An error occurred while fetching flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFlashcards([]);
    setSelectedSet('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="secondary">
            Saved Flashcard Sets
          </Typography>
          {loading && <CircularProgress color="secondary" />}
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            {savedFlashcardSets.map((set, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#2C2C2C', // Dark Gray for hover effect
                    },
                  }}
                  onClick={() => handleSetClick(set.name)}
                >
                  <CardContent>
                    <Typography variant="h6">{set.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 24,
            p: 4
          }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Flashcards for Set: {selectedSet}
            </Typography>
            <Grid container spacing={2}>
              {selectedFlashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                  <Card
                    sx={{
                      backgroundColor: 'background.paper',
                      color: 'text.primary',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#2C2C2C', // Dark Gray for hover effect
                      },
                    }}
                    onClick={() => setFlippedStates(prev => {
                      const newFlippedStates = [...prev];
                      newFlippedStates[index] = !newFlippedStates[index];
                      return newFlippedStates;
                    })}
                  >
                    <CardContent>
                      {flippedStates[index] ? (
                        <>
                          <Typography variant="h6" color="primary">Back:</Typography>
                          <Typography>{flashcard.back}</Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6" color="primary">Front:</Typography>
                          <Typography>{flashcard.front}</Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button onClick={handleCloseModal} variant="contained" color="primary" sx={{ mt: 2 }}>
              Close
            </Button>
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
}
