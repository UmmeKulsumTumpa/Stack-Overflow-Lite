// post.controller.js
const Post = require('../models/post.model');

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        res.status(200).json({ success: true, posts: posts });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id; // Change from _id to id

        if (!content) {
            return res.status(400).json({ message: 'Content is required.' });
        }

        const newPost = new Post({
            content: content,
            author_id: userId,
        });

        console.log(newPost);

        await newPost.save();
        console.log('Post created successfully.');

        res.status(201).json({ success: true, message: 'Post created successfully.', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
