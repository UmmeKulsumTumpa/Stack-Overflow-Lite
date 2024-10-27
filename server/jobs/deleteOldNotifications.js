// jobs/deleteOldNotifications.js
const Notification = require('../models/notification.model');

const deleteOldNotifications = async () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - 7);

    try {
        await Notification.deleteMany({ createdAt: { $lt: expiryDate } });
        console.log('Old notifications deleted successfully.');
    } catch (error) {
        console.error('Error deleting old notifications:', error);
    }
};

module.exports = deleteOldNotifications;
