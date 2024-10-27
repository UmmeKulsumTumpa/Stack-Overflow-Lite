const express = require('express');
const { getPosts, createPost } = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/getPost',  getPosts);

router.post('/createPost', authMiddleware, uploadMiddleware, createPost);

module.exports = router;
