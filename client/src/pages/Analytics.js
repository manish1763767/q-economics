import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import ProgressChart from '../components/analytics/ProgressChart';
import TopicStrengthRadar from '../components/analytics/TopicStrengthRadar';

function Analytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [subject, setSubject] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    progressData: [],
    topicStrength: [],
    summary: {
      testsCompleted: 0,
      averageScore: 0,
      timeSpent: 0,
      improvement: 0,
    },
  });

  const subjects = ['All Subjects', 'Microeconomics', 'Macroeconomics', 'Statistics'];
  const timeRanges = ['week', 'month', '3months', '6months', 'year'];

  const formatTimeRange = (range) => {
    switch (range) {
      case 'week':
        return 'Past Week';
      case 'month':
        return 'Past Month';
      case '3months':
        return 'Past 3 Months';
      case '6months':
        return 'Past 6 Months';
      case 'year':
        return 'Past Year';
      default:
        return range;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Performance Analytics</Typography>
        <Box display="flex" gap={2}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              label="Subject"
            >
              {subjects.map((sub) => (
                <MenuItem key={sub} value={sub.toLowerCase()}>
                  {sub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              {timeRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {formatTimeRange(range)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tests Completed
              </Typography>
              <Typography variant="h4">
                {analyticsData.summary.testsCompleted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Score
              </Typography>
              <Typography variant="h4">
                {analyticsData.summary.averageScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Time Spent
              </Typography>
              <Typography variant="h4">
                {analyticsData.summary.timeSpent}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Improvement
              </Typography>
              <Typography variant="h4" color={analyticsData.summary.improvement >= 0 ? 'success.main' : 'error.main'}>
                {analyticsData.summary.improvement > 0 ? '+' : ''}{analyticsData.summary.improvement}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProgressChart
            data={analyticsData.progressData}
            title="Score Progress Over Time"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopicStrengthRadar data={analyticsData.topicStrength} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Focus Areas
            </Typography>
            {/* Add recommendations based on analytics */}
          </Paper>
        </Grid>
      </Grid>

      {/* Export Options */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button variant="outlined" sx={{ mr: 2 }}>
          Export as PDF
        </Button>
        <Button variant="outlined">
          Export as Excel
        </Button>
      </Box>
    </Container>
  );
}

export default Analytics;
