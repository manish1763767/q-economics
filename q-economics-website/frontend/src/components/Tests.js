import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('/api/tests');
        setTests(response.data);
      } catch (error) {
        console.error('Failed to fetch tests', error);
      }
    };

    fetchTests();
  }, []);

  return (
    <div>
      <h2>Tests</h2>
      <div>
        {tests.map((test) => (
          <div key={test.id}>
            <h3>{test.name}</h3>
            <p>{test.description}</p>
            <button>Start Test</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tests;
