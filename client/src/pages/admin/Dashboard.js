import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const stats = {
    totalUsers: 150,
    activeTests: 25,
    totalAttempts: 450,
    recentActivity: [
      { id: 1, action: 'New Test Created', test: 'Macroeconomics Final', time: '2 hours ago' },
      { id: 2, action: 'Test Updated', test: 'Microeconomics Quiz 2', time: '5 hours ago' },
      { id: 3, action: 'New User Registration', user: 'John Doe', time: '1 day ago' },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/tests/create')}
        >
          Create New Test
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Overview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h3">{stats.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Active Tests</Typography>
            <Typography variant="h3">{stats.activeTests}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Test Attempts</Typography>
            <Typography variant="h3">{stats.totalAttempts}</Typography>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {stats.recentActivity.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemText
                    primary={activity.action}
                    secondary={activity.test || activity.user}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {activity.time}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Test Management
            </Typography>
            <Box display="flex" gap={2}>
              <Button variant="outlined" onClick={() => navigate('/admin/tests')}>
                View All Tests
              </Button>
              <Button variant="outlined" onClick={() => navigate('/admin/tests/create')}>
                Create Test
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <Box display="flex" gap={2}>
              <Button variant="outlined" onClick={() => navigate('/admin/users')}>
                View All Users
              </Button>
              <Button variant="outlined" onClick={() => navigate('/admin/reports')}>
                View Reports
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
