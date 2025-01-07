import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';

function Forum() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    tag: '',
    search: '',
    sort: 'newest',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'General Discussion',
    'Test Preparation',
    'Study Material',
    'Technical Support',
  ];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Discussion Forum</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/forum/new')}
        >
          New Discussion
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Discussions"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                label="Sort By"
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="unanswered">Unanswered</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Posts List */}
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography
                    variant="h6"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/forum/posts/${post.id}`)}
                  >
                    {post.title}
                  </Typography>
                  <Chip
                    label={post.isResolved ? 'Resolved' : 'Open'}
                    color={post.isResolved ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" variant="body2" gutterBottom>
                  Posted by {post.User.firstName} {post.User.lastName} on{' '}
                  {formatDate(post.createdAt)}
                </Typography>
                <Typography variant="body2" noWrap>
                  {post.content}
                </Typography>
                <Box mt={1}>
                  {post.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5 }}
                      onClick={() => handleFilterChange({ target: { name: 'tag', value: tag } })}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/forum/posts/${post.id}`)}>
                  {post.commentCount} Comments
                </Button>
                <Button size="small">
                  {post.views} Views
                </Button>
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

export default Forum;
