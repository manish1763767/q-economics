import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function ForumPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement comment submission
    setNewComment('');
    setReplyTo(null);
  };

  const renderComment = (comment, level = 0) => {
    return (
      <Box key={comment.id} sx={{ ml: level * 4, mb: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ mr: 1 }}>
              {comment.User.firstName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">
                {comment.User.firstName} {comment.User.lastName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {formatDate(comment.createdAt)}
              </Typography>
            </Box>
            {comment.isAnswer && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Best Answer"
                color="success"
                size="small"
                sx={{ ml: 'auto' }}
              />
            )}
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {comment.content}
          </Typography>
          <Box mt={1} display="flex" gap={1}>
            <Button
              size="small"
              onClick={() => setReplyTo(comment)}
            >
              Reply
            </Button>
            {!post.isResolved && post.userId === currentUser?.id && (
              <Button
                size="small"
                color="success"
                onClick={() => markAsAnswer(comment.id)}
              >
                Mark as Answer
              </Button>
            )}
          </Box>
        </Paper>
        {comment.replies?.map((reply) => renderComment(reply, level + 1))}
      </Box>
    );
  };

  if (!post) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Post Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">{post.title}</Typography>
          <Chip
            label={post.isResolved ? 'Resolved' : 'Open'}
            color={post.isResolved ? 'success' : 'default'}
          />
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ mr: 1 }}>
            {post.User.firstName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {post.User.firstName} {post.User.lastName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Posted on {formatDate(post.createdAt)}
            </Typography>
          </Box>
        </Box>
        <Box mb={2}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Box>
        <Box>
          {post.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 0.5 }}
            />
          ))}
        </Box>
      </Paper>

      {/* Comments Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        
        {/* New Comment Form */}
        <Box mb={3}>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? `Replying to ${replyTo.User.firstName}'s comment...` : "Write a comment..."}
              sx={{ mb: 1 }}
            />
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!newComment.trim()}
              >
                {replyTo ? 'Reply' : 'Comment'}
              </Button>
              {replyTo && (
                <Button
                  variant="outlined"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel Reply
                </Button>
              )}
            </Box>
          </form>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Comments List */}
        {post.comments
          .filter((comment) => !comment.parentId)
          .map((comment) => renderComment(comment))}
      </Paper>
    </Container>
  );
}

export default ForumPost;
