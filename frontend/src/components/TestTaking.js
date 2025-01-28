import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestTaking = ({ match }) => {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`/api/tests/${match.params.id}`);
        setTest(response.data);
      } catch (error) {
        console.error('Failed to fetch test', error);
      }
    };

    fetchTest();
  }, [match.params.id]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
    setFeedback({ ...feedback, [questionId]: 'Correct' });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/tests/${match.params.id}/submit`, { answers });
      console.log(response.data);
      // Handle successful test submission
    } catch (error) {
      console.error('Failed to submit test', error);
    }
  };

  if (!test) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{test.name}</h2>
      <p>{test.description}</p>
      {test.questions.map((question) => (
        <div key={question.id}>
          <h3>{question.text}</h3>
          {question.type === 'mcq' ? (
            <div>
              {question.options.map((option) => (
                <div key={option.id}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                  <label>{option.text}</label>
                </div>
              ))}
              {feedback[question.id] && <p>{feedback[question.id]}</p>}
            </div>
          ) : (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Test</button>
    </div>
  );
};

export default TestTaking;
