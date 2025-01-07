import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Pagination,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';

function PreviousYearPapers() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [filters, setFilters] = useState({
    year: '',
    examType: '',
    subject: '',
    difficulty: '',
    search: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const examTypes = ['Final Exam', 'Mid-term', 'Quiz', 'Practice Test'];
  const subjects = ['Microeconomics', 'Macroeconomics', 'Statistics', 'Economic History'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const handleStartTest = (paperId) => {
    navigate(`/papers/${paperId}/attempt`);
  };

  const handleDownloadPDF = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Previous Year Papers
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Papers"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                label="Year"
              >
                <MenuItem value="">All Years</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Exam Type</InputLabel>
              <Select
                name="examType"
                value={filters.examType}
                onChange={handleFilterChange}
                label="Exam Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {examTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                label="Subject"
              >
                <MenuItem value="">All Subjects</MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                label="Difficulty"
              >
                <MenuItem value="">All Levels</MenuItem>
                {difficulties.map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Papers List */}
      <Grid container spacing={3}>
        {papers.map((paper) => (
          <Grid item xs={12} md={6} key={paper.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {paper.title}
                </Typography>
                <Box display="flex" gap={1} mb={1}>
                  <Chip label={`Year: ${paper.year}`} size="small" />
                  <Chip label={paper.examType} size="small" />
                  <Chip
                    label={paper.difficulty}
                    size="small"
                    color={
                      paper.difficulty === 'Hard'
                        ? 'error'
                        : paper.difficulty === 'Medium'
                        ? 'warning'
                        : 'success'
                    }
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {paper.description}
                </Typography>
                <Box display="flex" gap={1}>
                  <Typography variant="body2">
                    Duration: {paper.duration} minutes
                  </Typography>
                  <Typography variant="body2">
                    Total Marks: {paper.totalMarks}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleStartTest(paper.id)}
                  variant="contained"
                  color="primary"
                >
                  Start Test
                </Button>
                {paper.pdfUrl && (
                  <Button
                    size="small"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => handleDownloadPDF(paper.pdfUrl)}
                  >
                    Download PDF
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
}

export default PreviousYearPapers;
