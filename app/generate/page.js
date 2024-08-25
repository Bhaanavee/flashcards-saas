'use client'

import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useUser } from '@clerk/nextjs';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';// Ensure this path is correct

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0000', // Bright Red for primary actions like buttons
    },
    secondary: {
      main: '#C0C0C0', // Silver for secondary elements
    },
    background: {
      default: '#FFFFF0', // Ivory for the background
      paper: '#333333', // Charcoal for card backgrounds
    },
    text: {
      primary: '#FFFFF0', // Ivory for text on dark backgrounds
      secondary: '#333333', // Charcoal for text on light backgrounds
    },
  },
})

export default function Generate() {
  const { user } = useUser();
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    setLoading(true);
    setError('');
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text }), // Ensure the text is sent in the correct format
        headers: { 'Content-Type': 'application/json' },
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  const saveFlashcards = async () => {
    if (!setName.trim()) {
        alert('Please enter a name for your flashcard set.');
        return;
    }

    try {
        const userDocRef = doc(db, 'users', user.id);
        const userDocSnap = await getDoc(userDocRef);

        const batch = writeBatch(db);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const updatedSets = [...(userData.flashcardSets || []), { name: setName }];
            batch.update(userDocRef, { flashcardSets: updatedSets });
        } else {
            batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
        }

        // Reference to the flashcard set document within the user's subcollection
        const setDocRef = doc(userDocRef, 'flashcardSets', setName);
        batch.set(setDocRef, { flashcards });

        await batch.commit();

        alert('Flashcards saved successfully!');
        handleCloseDialog();
        setSetName('');
    } catch (error) {
        console.error('Error saving flashcards:', error);
        alert(`An error occurred while saving flashcards: ${error.message}. Please try again.`);
    }
};


  

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="secondary">
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Generate Flashcards
          </Button>
        </Box>
        
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom color="secondary">
              Generated Flashcards
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
                    <CardContent>
                      <Typography variant="h6" color="secondary">Front:</Typography>
                      <Typography>{flashcard.front}</Typography>
                      <Typography variant="h6" sx={{ mt: 2 }} color="secondary">Back:</Typography>
                      <Typography>{flashcard.back}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {flashcards.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Save Flashcards
          </Button>
        </Box>
      )}
          </Box>
        )}
      </Container>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
