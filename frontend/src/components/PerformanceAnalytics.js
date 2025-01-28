import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PerformanceAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/api/analytics');
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch performance analytics', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Performance Analytics</h2>
      <div>
        <h3>Test History</h3>
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Date</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {analytics.testHistory.map((test) => (
              <tr key={test.id}>
                <td>{test.name}</td>
                <td>{test.date}</td>
                <td>{test.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>Progress Over Time</h3>
        <p>Graphs and charts showing progress over time will be displayed here.</p>
      </div>
      <div>
        <h3>Strengths and Weaknesses</h3>
        <p>Analysis of strengths and weaknesses based on performance in different subjects or topics will be displayed here.</p>
      </div>
      <div>
        <h3>Recommendations</h3>
        <p>Recommendations for tests or topics to focus on will be displayed here.</p>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
