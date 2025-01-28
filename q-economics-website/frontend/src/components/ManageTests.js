import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageTests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('/api/admin/tests');
        setTests(response.data);
      } catch (error) {
        console.error('Failed to fetch tests', error);
      }
    };

    fetchTests();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/tests/${id}`);
      setTests(tests.filter(test => test.id !== id));
    } catch (error) {
      console.error('Failed to delete test', error);
    }
  };

  return (
    <div>
      <h2>Manage Tests</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td>{test.id}</td>
              <td>{test.name}</td>
              <td>{test.description}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDelete(test.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTests;
