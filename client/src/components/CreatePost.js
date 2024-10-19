import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Import AuthContext
import '../styles/CreatePost.css'; // Make sure to create this CSS file

const CreatePost = () => {
  const { user } = useContext(AuthContext); // Get user from context
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCreatePost = async () => {
    if (!content) {
      setError('Content is required.');
      return;
    }

    if (!user || !user._id) {
      setError('User is not authenticated.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/posts/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, user_id: user._id }), // Use user._id from AuthContext
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Post created successfully!');
        setContent(''); // Clear input fields
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a New Post</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <textarea
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleCreatePost}>Create Post</button>
    </div>
  );
};

export default CreatePost;
