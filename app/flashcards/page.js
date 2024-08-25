'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flashcardSets, setFlashcardSets] = useState([]); // State to hold flashcard sets
  const [selectedSet, setSelectedSet] = useState(''); // State to track the selected set

  // Fetch flashcard sets when the user loads
  useEffect(() => {
    if (!user) return;

    async function fetchFlashcardSets() {
      try {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const setsSnapshot = await getDocs(collection(userDocRef, 'flashcardSets'));
        const sets = [];
        setsSnapshot.forEach(doc => sets.push(doc.id));
        setFlashcardSets(sets);
      } catch (err) {
        setError('Failed to load flashcard sets');
      }
    }

    fetchFlashcardSets();
  }, [user]);

  // Fetch flashcards for the selected set
  useEffect(() => {
    async function getFlashcards() {
      if (!selectedSet || !user) {
        setLoading(false);
        return;
      }

      try {
        const colRef = collection(doc(collection(db, 'users'), user.id), `flashcardSets/${selectedSet}/flashcards`);
        const docs = await getDocs(colRef);
        const flashcards = [];
        docs.forEach((doc) => {
          flashcards.push({ id: doc.id, ...doc.data() });
        });
        setFlashcards(flashcards);
      } catch (err) {
        setError('Failed to load flashcards');
      } finally {
        setLoading(false);
      }
    }

    getFlashcards();
  }, [selectedSet, user]);

  const handleSetClick = (setName) => {
    setSelectedSet(setName);
    setLoading(true);
    setError('');
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="sm">
      {flashcardSets.length > 0 ? (
        <List>
          {flashcardSets.map((setName) => (
            <ListItem button key={setName} onClick={() => handleSetClick(setName)}>
              <ListItemText primary={setName} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="h6" align="center">No flashcard sets found.</Typography>
      )}

      {flashcards.length > 0 && (
        flashcards.map((flashcard) => (
          <Box key={flashcard.id} sx={{ mb: 4, perspective: '1000px' }}>
            <Card
              sx={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'none',
              }}
            >
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent
                  sx={{
                    height: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backfaceVisibility: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Typography variant="h5" component="div">
                    {flipped[flashcard.id] ? flashcard.back : flashcard.front}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))
      )}
    </Container>
  );
}
