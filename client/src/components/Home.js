import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Home = () => {
    const { isAuthenticated, user } = React.useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Fetch posts with user ID if the user is logged in
                const url = isAuthenticated
                    ? `http://localhost:8000/posts/getPost?userId=${user._id}`
                    : 'http://localhost:8000/posts/getPost';

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setPosts(
                        [...data.posts].sort(
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                        )
                    );
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Failed to fetch posts.');
            }
        };

        fetchPosts();
    }, [isAuthenticated, user]);

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Recent Posts</h2>
            {error && <p className="text-red-500">{error}</p>}
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post._id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.content}</h3>
                        <p className="text-sm text-gray-500">Created at: {new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 text-center">No posts available</p>
            )}
        </div>
    );
};

export default Home;
