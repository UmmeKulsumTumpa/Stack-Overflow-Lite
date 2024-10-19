const express = require('express');
const { getNotifications, createNotification } = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/getNoti',  getNotifications);

router.post('/createNoti',  createNotification);

module.exports = router;
