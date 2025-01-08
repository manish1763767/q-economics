import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TestSubmission = () => {
    const { id } = useParams();
    const [answers, setAnswers] = useState({});
    const [submissionMessage, setSubmissionMessage] = useState('');

    const handleChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/tests/${id}/submit`, { userId: 1, answers }); // Replace userId with actual user ID
            setSubmissionMessage('Answers submitted successfully!');
        } catch (error) {
            setSubmissionMessage('Failed to submit answers. Please try again.');
        }
    };

    return (
        <div>
            <h1>Submit Answers for Test {id}</h1>
            <form onSubmit={handleSubmit}>
                {/* Replace with actual questions fetched from the API */}
                <div>
                    <label>Question 1:</label>
                    <input type="text" onChange={(e) => handleChange(1, e.target.value)} />
                </div>
                <div>
                    <label>Question 2:</label>
                    <input type="text" onChange={(e) => handleChange(2, e.target.value)} />
                </div>
                <button type="submit">Submit Answers</button>
            </form>
            {submissionMessage && <p>{submissionMessage}</p>}
        </div>
    );
};

export default TestSubmission;
