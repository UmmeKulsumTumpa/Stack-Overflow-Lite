const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {timestamps: true});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports=Notification;
