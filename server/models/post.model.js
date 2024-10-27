const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    file_url: {
        type: String,
    },
    file_name: {
        type: String, 
    },
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
