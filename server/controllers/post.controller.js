// post.controller.js
const Post = require('../models/post.model');
const minioClient = require('../utils/minioConfig');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
});

exports.uploadMiddleware = upload.single('file');

exports.getPosts = async (req, res) => {
    try {
        const { userId } = req.query;
        let posts;
        
        if (userId) {
            posts = await Post.find({ author_id: { $ne: userId } });
        } else {
            posts = await Post.find();
        }

        res.status(200).json({ success: true, posts: posts });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


exports.createPost = async (req, res) => {
    try {
        let title=null;
        const { title_, content } = req.body;
        const userId = req.user.id;

        if(title_!==undefined && title_!==null) title=title_;

        if (!content && !req.file) {
            return res.status(400).json({ message: 'Either content or file is required to create a post.' });
        }

        let fileUrl = null;
        let fileName = null;

        if (req.file) {
            const originalName = sanitize(req.file.originalname);
            const fileExtension = path.extname(originalName);
            const uniqueFileName = `${uuidv4()}${fileExtension}`;

            const metaData = {
                'Content-Type': req.file.mimetype,
            };

            await minioClient.putObject(process.env.MINIO_BUCKET, uniqueFileName, req.file.buffer, metaData);

            const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
            const url = `${protocol}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${uniqueFileName}`;

            fileUrl = url;
            fileName = originalName;
        }

        const newPost = new Post({
            content: content || '', 
            author_id: userId,
            file_url: fileUrl,
            file_name: fileName,
        });

        console.log('New Post:', newPost);

        await newPost.save();
        console.log('Post created successfully.');

        res.status(201).json({ success: true, message: 'Post created successfully.', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error.' });
    }
};

