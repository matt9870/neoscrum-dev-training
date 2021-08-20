const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const feedbackFormSchema = new mongoose.Schema({
    //object id of the sender/developer - to be added while generating the forms
    sender_id: {
        type: ObjectId,
        required: true
    },
    sender_name: {
        type:String,
        required:true
    },
    // triggered when user submits the feedback. If feedback empty then the value doesn't change
    submitted: {
        type: Boolean,
        default: false
    },
    //id of developer who is receiving the feedback
    receiver_id: {
        type: ObjectId,
        required: true
    },
    //name of developer receiving the feedback
    receiver_name: {
        type: String,
        required: true
    }    
})

const FeedbackForm = mongoose.model('FeedbackForm', feedbackFormSchema);

module.exports = FeedbackForm;