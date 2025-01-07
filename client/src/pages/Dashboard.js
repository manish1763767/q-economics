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
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Timer as TimerIcon,
  Score as ScoreIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      { subject: 'Microeconomics', progress: 80, color: '#4CAF50' },
      { subject: 'Macroeconomics', progress: 65, color: '#2196F3' },
      { subject: 'Statistics', progress: 75, color: '#9C27B0' },
      { subject: 'Economic History', progress: 90, color: '#FF9800' },
    ],
  };

  const StatCard = ({ icon: Icon, value, label, color }) => (
    <Card
      elevation={0}
      className="hover-card"
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: `${color}15`,
              color: color,
              width: 48,
              height: 48,
            }}
          >
            <Icon />
          </Avatar>
        </Box>
        <Typography variant="h4" component="div" fontWeight="600" gutterBottom>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        px: { xs: 2, sm: 3 },
        background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h1"
          gutterBottom
          fontWeight="600"
          sx={{ mb: 4 }}
        >
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Stats Overview */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={AssessmentIcon}
              value={mockUserStats.testsCompleted}
              label="Tests Completed"
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={ScoreIcon}
              value={`${mockUserStats.averageScore}%`}
              label="Average Score"
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={TimerIcon}
              value={mockUserStats.totalTime}
              label="Total Time Spent"
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={TrendingUpIcon}
              value="Top 15%"
              label="Class Rank"
              color={theme.palette.info.main}
            />
          </Grid>

          {/* Recent Tests */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="600">
                    Recent Tests
                  </Typography>
                  <Tooltip title="View all tests">
                    <IconButton size="small" color="primary">
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <List>
                  {mockUserStats.recentTests.map((test) => (
                    <ListItem
                      key={test.id}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="500">
                            {test.title}
                          </Typography>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mt: 0.5,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Score: {test.score}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {test.date}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Subject Performance */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight="600">
                    Subject Performance
                  </Typography>
                  <Tooltip title="View detailed analytics">
                    <IconButton size="small" color="primary">
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {mockUserStats.subjectPerformance.map((subject) => (
                  <Box key={subject.subject} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" fontWeight="500">
                        {subject.subject}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="500"
                        sx={{ color: subject.color }}
                      >
                        {subject.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={subject.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: `${subject.color}20`,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: subject.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;
