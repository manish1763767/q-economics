import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function TestResult({ result }) {
  const navigate = useNavigate();

  if (!result) {
    return null;
  }

  const { score, maxScore, percentage, results } = result;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        {/* Score Overview */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            Test Complete!
          </Typography>
          <Box position="relative" display="inline-flex" mb={2}>
            <CircularProgress
              variant="determinate"
              value={percentage}
              size={120}
              thickness={4}
              color={percentage >= 60 ? 'success' : 'error'}
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              right={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h4" component="div" color="textSecondary">
                {Math.round(percentage)}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Score: {score} / {maxScore}
          </Typography>
        </Box>

        {/* Performance Summary */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Correct Answers</Typography>
              <Typography variant="h4" color="success.main">
                {results.filter(r => r.correct).length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Incorrect Answers</Typography>
              <Typography variant="h4" color="error.main">
                {results.filter(r => !r.correct).length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Questions</Typography>
              <Typography variant="h4" color="primary">
                {results.length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/tests')}
          >
            Take Another Test
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default TestResult;
