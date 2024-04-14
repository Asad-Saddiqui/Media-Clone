const mongoose = require('mongoose')


const NotificationSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        name: String,
        img: String,
        action: String,
        postid: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification

