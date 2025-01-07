import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

function TestCreator() {
  const navigate = useNavigate();
  const [testData, setTestData] = useState({
    title: '',
    subject: '',
    description: '',
    difficulty: '',
    duration: 60,
    questions: [],
  });

  const addQuestion = () => {
    setTestData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          questionText: '',
          questionType: 'MCQ',
          options: ['', '', '', ''],
          correctAnswer: '',
          marks: 1,
        },
      ],
    }));
  };

  const removeQuestion = (questionId) => {
    setTestData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    setTestData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setTestData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to save test
    console.log('Test data:', testData);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Test
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Test Details */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Test Title"
                value={testData.title}
                onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  value={testData.subject}
                  onChange={(e) => setTestData({ ...testData, subject: e.target.value })}
                  label="Subject"
                  required
                >
                  <MenuItem value="Microeconomics">Microeconomics</MenuItem>
                  <MenuItem value="Macroeconomics">Macroeconomics</MenuItem>
                  <MenuItem value="Statistics">Statistics</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={testData.description}
                onChange={(e) => setTestData({ ...testData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={testData.difficulty}
                  onChange={(e) => setTestData({ ...testData, difficulty: e.target.value })}
                  label="Difficulty"
                  required
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={testData.duration}
                onChange={(e) => setTestData({ ...testData, duration: e.target.value })}
                required
              />
            </Grid>
          </Grid>

          {/* Questions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Questions
            </Typography>
            {testData.questions.map((question, index) => (
              <Card key={question.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Question {index + 1}</Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Question Text"
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(question.id, 'questionText', e.target.value)
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Question Type</InputLabel>
                        <Select
                          value={question.questionType}
                          onChange={(e) =>
                            updateQuestion(question.id, 'questionType', e.target.value)
                          }
                          label="Question Type"
                        >
                          <MenuItem value="MCQ">Multiple Choice</MenuItem>
                          <MenuItem value="MultiSelect">Multiple Select</MenuItem>
                          <MenuItem value="Detailed">Detailed Answer</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Marks"
                        value={question.marks}
                        onChange={(e) =>
                          updateQuestion(question.id, 'marks', e.target.value)
                        }
                        required
                      />
                    </Grid>
                    {question.questionType !== 'Detailed' && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Options
                        </Typography>
                        {question.options.map((option, optionIndex) => (
                          <TextField
                            key={optionIndex}
                            fullWidth
                            label={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              updateOption(question.id, optionIndex, e.target.value)
                            }
                            sx={{ mb: 1 }}
                            required
                          />
                        ))}
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Correct Answer"
                        value={question.correctAnswer}
                        onChange={(e) =>
                          updateQuestion(question.id, 'correctAnswer', e.target.value)
                        }
                        required
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addQuestion}
            sx={{ mb: 3 }}
          >
            Add Question
          </Button>

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={testData.questions.length === 0}
            >
              Create Test
            </Button>
            <Button variant="outlined" onClick={() => navigate('/admin/tests')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default TestCreator;
