const Notification = require('../models/notification.model');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.user._id });
        res.status(200).json({success: true, notifications: notifications});
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const { post_id } = req.body;
        const notification = new Notification({ post_id, user_id: req.user._id });
        await notification.save();
        res.status(201).json({success:true, notification: notification});
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
