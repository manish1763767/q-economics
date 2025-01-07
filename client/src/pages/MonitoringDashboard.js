import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function MonitoringDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/status');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">System Monitoring</Typography>
        <IconButton onClick={fetchMetrics}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* System Health Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                CPU Usage
              </Typography>
              <Box display="flex" alignItems="center">
                <CircularProgress
                  variant="determinate"
                  value={parseFloat(metrics.system.cpu.usage)}
                  color={metrics.system.cpu.usage > 80 ? 'error' : 'primary'}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h5">
                  {metrics.system.cpu.usage}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Memory Usage
              </Typography>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {metrics.system.memory.usage}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(metrics.system.memory.usage)}
                  color={parseFloat(metrics.system.memory.usage) > 90 ? 'error' : 'primary'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Database Status
              </Typography>
              <Box display="flex" alignItems="center">
                {metrics.system.database.status === 'healthy' ? (
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                ) : (
                  <WarningIcon color="error" sx={{ mr: 1 }} />
                )}
                <Typography>
                  {metrics.system.database.status}
                </Typography>
              </Box>
              <Typography variant="caption" display="block">
                {metrics.system.database.connections} active connections
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h5">
                {metrics.application.activeUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.performance.history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#8884d8"
                  name="Response Time (ms)"
                />
                <Line
                  type="monotone"
                  dataKey="errorRate"
                  stroke="#82ca9d"
                  name="Error Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Slow Queries */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Slow Queries
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Query</TableCell>
                    <TableCell align="right">Calls</TableCell>
                    <TableCell align="right">Total Time</TableCell>
                    <TableCell align="right">Mean Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {metrics.performance.slowQueries.map((query, index) => (
                    <TableRow key={index}>
                      <TableCell>{query.query}</TableCell>
                      <TableCell align="right">{query.calls}</TableCell>
                      <TableCell align="right">
                        {(query.total_time / 1000).toFixed(2)}s
                      </TableCell>
                      <TableCell align="right">
                        {(query.mean_time / 1000).toFixed(2)}s
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MonitoringDashboard;
