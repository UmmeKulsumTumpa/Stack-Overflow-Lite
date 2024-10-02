const express = require('express');
const authRoutes = require('./api/auth.api');
const postRoutes = require('./api/post.api');
const notificationRoutes = require('./api/notification.api');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
