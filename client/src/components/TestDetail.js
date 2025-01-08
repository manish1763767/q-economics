import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TestDetail = () => {
    const { id } = useParams();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestDetail = async () => {
            try {
                const response = await axios.get(`/tests/${id}`);
                setTest(response.data);
            } catch (err) {
                setError('Failed to fetch test details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTestDetail();
    }, [id]);

    if (loading) return <div>Loading test details...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{test.title}</h1>
            <p><strong>Subject:</strong> {test.subject}</p>
            <p><strong>Difficulty:</strong> {test.difficulty}</p>
            <h2>Questions</h2>
            <ul>
                {test.Questions.map(question => (
                    <li key={question.id}>{question.questionText}</li>
                ))}
            </ul>
        </div>
    );
};

export default TestDetail;
