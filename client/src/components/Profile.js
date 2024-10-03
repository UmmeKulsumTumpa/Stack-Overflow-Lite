import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user details (e.g., email)
    const token = localStorage.getItem('token');
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setEmail(data.email);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch user details.');
      }
    };

    // Fetch the user's own posts
    const fetchUserPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/posts/userPosts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          // Sort posts by earliest first (ascending order)
          setPosts(data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch user posts.');
      }
    };

    fetchUserProfile();
    fetchUserPosts();
  }, []);

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {error && <p>{error}</p>}
      <p>Email: {email}</p>
      
      <button className="create-post-button">
        <Link to="/create-post">Create Post</Link>
      </button>

      <h3>Your Posts</h3>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Profile;
