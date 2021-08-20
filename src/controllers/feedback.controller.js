const feedbackModel = require('../models/feedback.model');
const feedbackFormModel = require('../models/feedbackForm.model');
const userModel = require('../models/user.model');
const sendFeedbackEmail = require('../emails/sendEmail');


//main controllers
exports.addFeedback = async (req, res) => {
    const id = req.params.id;
    let user = await userModel.find({ dev_name: res.locals.username });
    const sender = user[0];
    const feedbackForm = await feedbackFormModel.findById(id);
    const receiver = await userModel.findById(feedbackForm.receiver_id);

    console.log(`FeedbackForm status - ${feedbackForm.submitted} \nsender - ${sender.dev_name}, \nfeedbackform being submitted to - ${feedbackForm.receiver_name}, and\nreceiver - ${receiver.dev_name}`);

    if (req.body.feedback.length < 10 || req.body.feedback.length > 100 || feedbackForm.submitted) {
        let message = "Need to add feedback with atleat 10 and maximum 100 characters";
        if(feedbackForm.submitted)
            message = "Feedback already submitted"
        res.status(400).send({message});
        return;
    }

    const feedback = new feedbackModel({
        dev_id: receiver._id,
        feedback: req.body.feedback,
        sender_id: sender._id,
        sender_name: sender.dev_name,
    });
    receiver.feedbacks_received.push(feedback);
    feedbackForm.submitted = true;

    receiver.save(receiver).then().catch(err => {
        console.log("error occurred", err);
        res.status(400).send({
            message: `Error occurred while saving feedback to user data`,
            err
        });
        return;
    });

    feedback.save(feedback).then().catch(err =>{
        console.log("error occurred", err);
        res.status(400).send({
            message: `Error occurred while saving feedback to DB`,
            err
        });
        return;
    })

    feedbackForm.save(feedbackForm).then(data => {
        
        let emailStatus='Feedback Email was not sent'

        let emailSent = sendFeedbackEmail({
            sender_name: data.sender_name,
            sender_email: sender.dev_email,
            receiver:receiver.dev_email,
            feedback: req.body.feedback,
            loginUrl: `http://localhost:3000/login`
        });
        if(emailSent) emailStatus=`Feedback email was sent succesfully`;

        res.status(200).send({
            message: 'Feedback added and saved to user. Feedbackform altered.',
            data,
            emailStatus
        });
        }).catch(err => {
        console.log("error occurred", err);
        res.status(400).send({
            message: `Error occurred while saving feedbackform`,
            err
        });
    });
}

//cron job that is run on Fridays
exports.addFeedbackForms = async () => {
    userModel.find({}, (err) => {
        if (err) {
            console.log(err);
            throw new Error;
        }
    }).then(data => {
        var msg = [];
        //iterating through each user
        data.forEach(sender => {
            //user1     //user2 //user3
            if (sender.role === 'developer') {
                //iterating through users except the sender
                data.forEach(receiver => {
                    if (sender._id !== receiver._id && receiver.role === 'developer') {
                        const feedbackForm = new feedbackFormModel({
                            sender_id: sender._id,
                            sender_name: sender.dev_name,
                            receiver_id: receiver._id,
                            receiver_name: receiver.dev_name
                        })
                        sender.feedbacks_to_send.push(feedbackForm._id);

                        feedbackForm.save(feedbackForm).then().catch(err => {
                            console.log(err);
                        })
                    }
                })
                sender.save(sender).then().catch(err => {
                    console.log(err);
                })
            }
        });
        console.log(`cron job to add feedbacks forms for each user has been completed successfully`);
    }).catch(err => {
        console.log(err);
        throw new Error;
    })
}

exports.viewFeedbackForms = async (req, res) => {
    userModel.find({ dev_name: res.locals.username }, (err) => {
        if (err) {
            console.log(err);
        }
    }).then(async (userData) => {
        const feedbacksToSend = await getFeedbackForms(userData);
        res.status(200).send({
            msg: `Got the feedbacks to be submitted`,
            username: userData[0].dev_name,
            feedbacksToSend,
            email: userData[0].dev_email,
            userid: userData[0]._id
        })
    }).catch(err => {
        console.log(err);
        res.status(400).send({ err })
    });
}

async function getFeedbackForms(userData) {
    let feedbacksToSend = [];
    no_feedbacksToSend = userData[0].feedbacks_to_send.length;
    for (let i = 0; i < no_feedbacksToSend; i++) {
        let id = userData[0].feedbacks_to_send[i];
        await feedbackFormModel.findById(id).then(fbForm => {
            if (!fbForm.submitted) {
                feedbacksToSend.push(fbForm);
            }
        }).catch(err => {
            console.log(err);
            return;
        })
    }
    return feedbacksToSend
}

//other controllers
//api written for testing
exports.addFeedbackForm = async (req, res) => {

    userModel.find({}, (err) => {
        if (err) {
            console.log(err);
            res.status(400).send({ err });
            return;
        }
    }).then(data => {
        var msg = [];
        //iterating through each user
        data.forEach(sender => {
            //user1     //user2 //user3
            if (sender.role === 'developer') {
                //iterating through users except the sender
                data.forEach(receiver => {
                    if (sender._id !== receiver._id && receiver.role === 'developer') {
                        const feedbackForm = new feedbackFormModel({
                            sender_id: sender._id,
                            sender_name: sender.dev_name,
                            receiver_id: receiver._id,
                            receiver_name: receiver.dev_name
                        })
                        sender.feedbacks_to_send.push(feedbackForm._id);

                        feedbackForm.save(feedbackForm).then().catch(err => {
                            console.log(err);
                        })
                    }
                })
                sender.save(sender).then().catch(err => {
                    console.log(err);
                })
            }
        });

        res.status(200).send({ msg: `test complete` });

    }).catch(err => {
        console.log(err);
        res.status(400).send({
            message: err.message || 'Some error occurred while getting users'
        })
    })
}

exports.deleteAllForms = async (req, res) => {
    feedbackFormModel.deleteMany({}, err => {
        if (err) {
            throw new Error;
        }
    }).then(data => {
        userModel.find({}, (err) => {
            if (err) {
                res.status(400).send({ err });
                return;
            }
        }).then(data => {
            data.forEach(user => {
                user.feedbacks_to_send = [];
                user.save(user).then().catch(err => console.log(err));
            })
        }).catch(err => res.status(400).send({ err, msg: `unsucessful` }));
        res.status(200).send({ msg: 'all forms deleted successfully' })
    })
}

exports.deleteAllFeedbacks = async (req, res) => {
    userModel.find({}, (err) => {
        if (err) {
            res.status(400).send({ err });
            return;
        }
    }).then(data => {
        data.forEach(async function (user) {
            let currentUserData = await userModel.findById(user._id)
            currentUserData.feedbacks_received = [];
            currentUserData.save(currentUserData).then(() => {
                console.log(`feedbacks deleted for ${user.dev_name}`);
            }).catch(err => {
                console.log(`feedbacks not deleted for ${user.dev_name}\n${err}`);
            });
        })
        feedbackModel.Feedback.deleteMany({}, (err, feedbacks) => {
            if (err) {
                res.status(400).send({
                    message: "Feedbacks not deleted"
                })
            }
            res.status(200).send({
                message: "All Feedbacks deleted",
                feedbacks
            })
        })
    }).catch(err => {
        res.status(400).send({
            message: err.message || 'Some error occurred while getting users'
        })
    })

}

