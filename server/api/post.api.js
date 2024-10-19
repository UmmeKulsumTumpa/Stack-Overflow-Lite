const express = require('express');
const { getPosts, createPost } = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/getPost',  getPosts);

router.post('/createPost', authMiddleware,  createPost);

module.exports = router;
