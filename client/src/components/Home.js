import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/posts/getPost', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        setError('Failed to fetch posts.');
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button className="nav-link" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-link">Register</Link>
              <Link to="/signin" className="nav-link">Sign In</Link>
            </>
          )}
        </div>
      </div>

      <h2>Recent Posts</h2>
      {error && <p>{error}</p>}
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
