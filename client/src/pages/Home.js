import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const features = [
    {
      title: 'Practice Tests',
      description: 'Access a wide range of mock tests designed to help you prepare effectively. Our tests are crafted by expert educators.',
      icon: SchoolIcon,
      action: () => navigate('/tests'),
    },
    {
      title: 'Previous Year Papers',
      description: 'Study with actual previous year papers to understand exam patterns and improve your preparation strategy.',
      icon: AssessmentIcon,
      action: () => navigate('/tests'),
    },
    {
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics, identify weak areas, and get personalized recommendations.',
      icon: TimelineIcon,
      action: () => navigate('/dashboard'),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '90vh',
        background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ py: { xs: 4, md: 8 } }}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              <Typography
                variant={isMobile ? 'h4' : 'h2'}
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome to Q-Economics
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                paragraph
                sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
              >
                Your comprehensive platform for economics exam preparation. Practice with
                mock tests, analyze your performance, and achieve your academic goals.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                  }}
                >
                  Login
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Features Section */}
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                className="hover-card"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: 2,
                      mb: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                    }}
                  >
                    <feature.icon
                      sx={{
                        fontSize: 32,
                        color: theme.palette.primary.main,
                      }}
                    />
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="600">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={feature.action}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
