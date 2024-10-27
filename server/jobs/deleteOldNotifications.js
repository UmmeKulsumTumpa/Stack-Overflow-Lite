const Notification = require('../models/notification.model');

const deleteOldNotifications = async () => {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() - 20);

    try {
        await Notification.deleteMany({ createdAt: { $lt: expiryDate } });
        console.log('Old notifications deleted successfully.');
    } catch (error) {
        console.error('Error deleting old notifications:', error);
    }
};

module.exports = deleteOldNotifications;
