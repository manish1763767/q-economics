import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';

function Dashboard() {
  const mockUserStats = {
    testsCompleted: 15,
    averageScore: 75,
    totalTime: '24h 30m',
    recentTests: [
      { id: 1, title: 'Microeconomics Test 1', score: 85, date: '2024-01-05' },
      { id: 2, title: 'Macroeconomics Basics', score: 78, date: '2024-01-03' },
      { id: 3, title: 'Economics Statistics', score: 92, date: '2024-01-01' },
    ],
    subjectPerformance: [
      { subject: 'Microeconomics', progress: 80 },
      { subject: 'Macroeconomics', progress: 65 },
      { subject: 'Statistics', progress: 75 },
      { subject: 'Economic History', progress: 90 },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Stats Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4">{mockUserStats.testsCompleted}</Typography>
                  <Typography color="textSecondary">Tests Completed</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4">{mockUserStats.averageScore}%</Typography>
                  <Typography color="textSecondary">Average Score</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h4">{mockUserStats.totalTime}</Typography>
                  <Typography color="textSecondary">Total Time Spent</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Tests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Tests
            </Typography>
            <List>
              {mockUserStats.recentTests.map((test) => (
                <ListItem key={test.id}>
                  <ListItemText
                    primary={test.title}
                    secondary={`Score: ${test.score}% | Date: ${test.date}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Subject Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Subject Performance
            </Typography>
            {mockUserStats.subjectPerformance.map((subject) => (
              <Box key={subject.subject} sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  {subject.subject}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box width="100%" mr={1}>
                    <LinearProgress
                      variant="determinate"
                      value={subject.progress}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">
                      {subject.progress}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
