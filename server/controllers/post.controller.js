const Post=require('../models/post.model');

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        const filteredPosts = posts.filter(post => post.author_id.toString() !== req.user._id.toString());

        res.status(200).json({success: true, posts: filteredPosts});
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const post = new Post({ author_id: req.user._id, content });
        await post.save();
        res.status(201).json({success: true, post: post});
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

