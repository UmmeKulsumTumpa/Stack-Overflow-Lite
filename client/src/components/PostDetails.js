import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PostDetails.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/posts/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setPost(data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch post details.');
      }
    };

    fetchPostDetail();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-container">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetail;
