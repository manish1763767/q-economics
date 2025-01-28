import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <label>Email:</label>
        <span>{user.email}</span>
      </div>
      <div>
        <label>Name:</label>
        <span>{user.name}</span>
      </div>
      <button>Edit Profile</button>
      <button>Change Password</button>
    </div>
  );
};

export default Profile;
