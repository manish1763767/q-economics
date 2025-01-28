import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/api/recommendations');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      <h2>AI-Powered Recommendations</h2>
      <div>
        {recommendations.map((recommendation) => (
          <div key={recommendation.id}>
            <h3>{recommendation.title}</h3>
            <p>{recommendation.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
