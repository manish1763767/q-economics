import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function TestInterface({ test, onSubmit }) {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(test?.duration * 60 || 0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderQuestion = () => {
    const question = test.questions[currentQuestion];

    switch (question.questionType) {
      case 'MCQ':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          >
            {question.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        );

      case 'MultiSelect':
        return question.options.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={answers[question.id]?.includes(option) || false}
                onChange={(e) => {
                  const currentAnswers = answers[question.id] || [];
                  const newAnswers = e.target.checked
                    ? [...currentAnswers, option]
                    : currentAnswers.filter((a) => a !== option);
                  handleAnswerChange(question.id, newAnswers);
                }}
              />
            }
            label={option}
          />
        ));

      case 'Detailed':
        return (
          <TextField
            fullWidth
            multiline
            rows={6}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            variant="outlined"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h6">
            Question {currentQuestion + 1} of {test.questions.length}
          </Typography>
          <Typography variant="h6" color="primary">
            Time Left: {formatTime(timeLeft)}
          </Typography>
        </Box>

        {/* Question */}
        <Box mb={4}>
          <Typography variant="body1" gutterBottom>
            {test.questions[currentQuestion].questionText}
          </Typography>
          {renderQuestion()}
        </Box>

        {/* Navigation */}
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
          >
            Previous
          </Button>
          {currentQuestion === test.questions.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowConfirmDialog(true)}
            >
              Submit Test
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Submit Test</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit the test? You cannot change your answers after
            submission.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TestInterface;
