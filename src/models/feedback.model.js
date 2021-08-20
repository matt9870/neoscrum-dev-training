const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const feedbackSchema = new mongoose.Schema({
    dev_id: {
        type: ObjectId,
        required: true
    }, //id of the developer
    feedback: {
        type: String,
        required: true
    },
    sender_id: {
        type: ObjectId,
        required: true
    }, //id of the sender/developer who shared the feedback
    sender_name: {
        type: String,
        required: true
    } //name of the developer who shared the feedback
},
    { timestamps: true }
);

const Feedback = mongoose.model('feedback', feedbackSchema);

module.exports = Feedback;