import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PreviousYearPapers = () => {
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.get('/api/previous-year-papers');
        setPapers(response.data);
      } catch (error) {
        console.error('Failed to fetch previous year papers', error);
      }
    };

    fetchPapers();
  }, []);

  return (
    <div>
      <h2>Previous Year Papers</h2>
      <div>
        {papers.map((paper) => (
          <div key={paper.id}>
            <h3>{paper.name}</h3>
            <p>{paper.description}</p>
            <a href={paper.url} target="_blank" rel="noopener noreferrer">Download PDF</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousYearPapers;
