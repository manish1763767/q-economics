import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';

const mockTests = [
  {
    id: 1,
    title: 'Microeconomics Fundamentals',
    subject: 'Economics',
    difficulty: 'Medium',
    duration: 60,
    questionCount: 50,
  },
  {
    id: 2,
    title: 'Macroeconomics Basics',
    subject: 'Economics',
    difficulty: 'Easy',
    duration: 45,
    questionCount: 30,
  },
  // Add more mock tests here
];

function TestCatalog() {
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    difficulty: '',
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredTests = mockTests.filter((test) => {
    return (
      test.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.subject === '' || test.subject === filters.subject) &&
      (filters.difficulty === '' || test.difficulty === filters.difficulty)
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Catalog
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search Tests"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                name="subject"
                value={filters.subject}
                label="Subject"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Economics">Economics</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Statistics">Statistics</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={filters.difficulty}
                label="Difficulty"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Test Cards */}
      <Grid container spacing={3}>
        {filteredTests.map((test) => (
          <Grid item xs={12} sm={6} md={4} key={test.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {test.title}
                </Typography>
                <Typography color="textSecondary">
                  Subject: {test.subject}
                </Typography>
                <Typography color="textSecondary">
                  Difficulty: {test.difficulty}
                </Typography>
                <Typography color="textSecondary">
                  Duration: {test.duration} minutes
                </Typography>
                <Typography color="textSecondary">
                  Questions: {test.questionCount}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                <Button size="small" variant="contained" color="primary">
                  Start Test
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default TestCatalog;
