import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Admin() {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');

  // Mock data - replace with actual API calls
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'teacher' },
  ]);

  const [tests] = useState([
    { id: 1, title: 'Microeconomics Test 1', subject: 'Microeconomics', duration: '60 mins' },
    { id: 2, title: 'Macroeconomics Quiz', subject: 'Macroeconomics', duration: '30 mins' },
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="600">
          Admin Dashboard
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Users" />
            <Tab label="Tests" />
            <Tab label="Reports" />
          </Tabs>
        </Box>

        {/* Users Panel */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Manage Users</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('user')}
            >
              Add User
            </Button>
          </Box>
          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemText
                  primary={user.name}
                  secondary={
                    <>
                      {user.email} • {user.role}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Tests Panel */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Manage Tests</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('test')}
            >
              Create Test
            </Button>
          </Box>
          <List>
            {tests.map((test) => (
              <ListItem
                key={test.id}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemText
                  primary={test.title}
                  secondary={
                    <>
                      {test.subject} • {test.duration}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Reports Panel */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h3" color="primary">
                  {users.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Active Tests
                </Typography>
                <Typography variant="h3" color="primary">
                  {tests.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Tests Completed
                </Typography>
                <Typography variant="h3" color="primary">
                  0
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialogType === 'user' ? 'Add New User' : 'Create New Test'}
          </DialogTitle>
          <DialogContent>
            {dialogType === 'user' ? (
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Role"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Box>
            ) : (
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="Test Title"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Subject"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleCloseDialog}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default Admin;
