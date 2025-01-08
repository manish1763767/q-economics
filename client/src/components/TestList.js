import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TestList = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get('/tests');
                setTests(response.data);
            } catch (err) {
                setError('Failed to fetch tests. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, []);

    if (loading) return <div>Loading tests...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Available Tests</h1>
            <ul>
                {tests.map(test => (
                    <li key={test.id}>
                        <Link to={`/tests/${test.id}`}>{test.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestList;
