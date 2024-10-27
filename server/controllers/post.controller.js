const Post = require('../models/post.model');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');
const minioClient = require('../utils/minioConfig');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const mime = require('mime-types');
const sanitize = require('sanitize-filename');

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
        const { title, content, codeSnippet } = req.body;
        const userId = req.user.id;

        if (!content && !req.file && !codeSnippet) {
            return res.status(400).json({ message: 'Content, file, or code snippet is required to create a post.' });
        }

        let fileUrl = null;
        let fileName = null;
        let fileType = null;
        let codeSnippetUrl = null;

        // Handling file upload if provided
        if (req.file) {
            const originalName = sanitize(req.file.originalname);
            const fileExtension = path.extname(originalName);
            const uniqueFileName = `${uuidv4()}${fileExtension}`;
            fileType = req.file.mimetype || mime.lookup(fileExtension); // Detect file type

            const metaData = {
                'Content-Type': fileType,
            };

            await minioClient.putObject(process.env.MINIO_BUCKET, uniqueFileName, req.file.buffer, metaData);

            const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
            const url = `${protocol}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${uniqueFileName}`;

            fileUrl = url;
            fileName = originalName;
        }

        // Handling code snippet if provided
        if (codeSnippet) {
            const snippetFileName = `${uuidv4()}.txt`; // Save code snippets as .txt files

            // Create a buffer from the code snippet text
            const buffer = Buffer.from(codeSnippet, 'utf-8');
            const metaData = {
                'Content-Type': 'text/plain',
            };

            // Upload the code snippet buffer to MinIO
            await minioClient.putObject(process.env.MINIO_BUCKET, snippetFileName, buffer, metaData);

            const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
            codeSnippetUrl = `${protocol}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${snippetFileName}`;
        }

        const newPost = new Post({
            title: title || 'Unknown', // Set the title if provided, otherwise use "Unknown"
            content: content || '', 
            author_id: userId,
            file_url: fileUrl,
            file_name: fileName,
            code_snippet_url: codeSnippetUrl, // Save the code snippet URL
        });

        console.log('New Post:', newPost);

        await newPost.save();
        // console.log('Post created successfully.');
        const users = await User.find({ _id: { $ne: userId } });
        const notifications = users.map(user => ({
            recipient: user._id,
            postId: newPost._id,
            message: `A new post named: "${newPost.title}"`,
            isSeen: false,
        }));

        await Notification.insertMany(notifications);


        res.status(201).json({ success: true, message: 'Post created successfully.', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch all posts for the specified user
        const userPosts = await Post.find({ author_id: userId });

        if (!userPosts.length) {
            return res.status(404).json({ success: false, message: 'No posts found for this user.' });
        }
        
        res.status(200).json({ success: true, posts: userPosts });
    } catch (err) {
        console.error('Error fetching user posts:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
