import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles/Home.css';

const Home = () => {
	const { isAuthenticated, logout } = React.useContext(AuthContext);
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch('http://localhost:8000/posts/getPost', {
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
			{posts.length > 0 ? (
				posts.map((post) => (
					<div key={post._id} className="post">
						<h3>{post.content}</h3>
						<p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
					</div>
				))
			) : (
				<p>No posts available</p>
			)}
		</div>
	);
};

export default Home;
