'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; 

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(window.location.search);
  const search = searchParams.get('id');

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) {
        setLoading(false);
        return;
      }

      try {
        const colRef = collection(doc(collection(db, 'users'), user.id), search);
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
    getFlashcard();
  }, [search, user]);

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
      {flashcards.length === 0 ? (
        <Typography variant="h6" align="center">No flashcards found.</Typography>
      ) : (
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
