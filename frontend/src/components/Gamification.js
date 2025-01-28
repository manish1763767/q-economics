import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Gamification = () => {
  const [badges, setBadges] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await axios.get('/api/badges');
        setBadges(response.data);
      } catch (error) {
        console.error('Failed to fetch badges', error);
      }
    };

    const fetchPoints = async () => {
      try {
        const response = await axios.get('/api/points');
        setPoints(response.data);
      } catch (error) {
        console.error('Failed to fetch points', error);
      }
    };

    fetchBadges();
    fetchPoints();
  }, []);

  return (
    <div>
      <h2>Gamification</h2>
      <div>
        <h3>Badges</h3>
        <div>
          {badges.map((badge) => (
            <div key={badge.id}>
              <img src={badge.image} alt={badge.name} />
              <p>{badge.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3>Points</h3>
        <p>{points}</p>
      </div>
    </div>
  );
};

export default Gamification;
