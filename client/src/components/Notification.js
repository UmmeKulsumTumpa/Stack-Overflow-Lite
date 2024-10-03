import React, { useEffect, useState } from 'react';
import '../styles/Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/notifications/getNoti', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setNotifications(data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch notifications.');
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      {error && <p>{error}</p>}
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notification;
