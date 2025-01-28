import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiscussionForums = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/forums');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch forum posts', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Discussion Forums</h2>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>Posted by: {post.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionForums;
