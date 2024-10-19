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
        const { content, user_id } = req.body;
        console.log(`Content: ${content}`);
        console.log(`User ID: ${user_id}`);

        const post = new Post({ author_id: user_id, content });
        await post.save();

        res.status(201).json({ success: true, post: post });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
