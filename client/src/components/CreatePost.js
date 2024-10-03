import React, { useState } from 'react';
import '../styles/CreatePost.css'; // Make sure to create this CSS file

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCreatePost = async () => {
    if ( !content) {
      setError('content is required.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/posts/createPost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Post created successfully!');
        setTitle('');
        setContent('');
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
      
      {/* <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /> */}
      
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
