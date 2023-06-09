const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    issueId: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 5
    },
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
        default: [],
    }
}, {
    timestamps: true
})

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
