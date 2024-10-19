// CreatePost.js
import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; 
import '../styles/CreatePost.css'; 
import { useNavigate } from 'react-router-dom'; 

const CreatePost = () => {
    const { user, token, logout } = useContext(AuthContext); 
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

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
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({ content }), // Removed user_id
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Post created successfully!');
                setContent(''); // Clear input fields
                setError(null);
                // Optionally navigate to another page
                // navigate('/some-route');
            } else {
                setError(data.message || 'Failed to create post.');
                if (response.status === 401) {
                    logout(); // Optionally logout if unauthorized
                }
            }
        } catch (error) {
            console.error('Error creating post:', error);
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
                rows="4"
                cols="50"
            />

            <button onClick={handleCreatePost}>Create Post</button>
        </div>
    );
};

export default CreatePost;
