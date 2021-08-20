const config = require('../config/default.json');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.APP.EMAIL_CONFIG.EMAIL,
        pass: config.APP.EMAIL_CONFIG.PASSWORD,
    },
});

module.exports = async function sendWelcomeEmail(data) {
    try {
        console.log(data);
     
        let info = await transporter.sendMail(mailOptions);
        console.log(info);
        console.log("Message sent: %s", info.messageId);
        return true;
    
    } catch (error) {
        console.log(error);
        return false
    }
}


module.exports = async function sendFeedbackEmail(data) {
    var mailOptions = {
        from: 'Admin',
        to: `${data.receiver}`,
        subject: `Feedback from ${data.sender_name}`,
        html: `<h2>You got a new feedback from ${data.sender_name}</h2>
              <h4>Feedback: ${data.feedback}</h4>
              <p>Use this link to login: ${data.loginUrl}<p>`,
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    return true;
}
