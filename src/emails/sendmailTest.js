const config = require('../config/default.json');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.APP.EMAIL_CONFIG.EMAIL,
        pass: config.APP.EMAIL_CONFIG.PASSWORD,
    },
});

const mailOptionsData = {
    name: 'test1',
    email: 'test1@neoscrum.com',
    password: 'password',
    loginUrl: `http://localhost:3000/login`
}

async function sendWelcomeEmail(data) {
    try {
        console.log(data);

        var mailOptions = {
            from: 'Admin',
            to: data.email,
            subject: "Welcome to Neoscrum",
            html: `<h2>You have been succesfully registered in Neoscrum Application<h2>
                  <h3>Congrats ${data.name} <br>You are now part of our Development Team </h3>
                  <h4>Please find below your credentials to sign in</h4>
                  <p>username : ${data.email} <br/> password : ${data.password}</p>
                  <p>Use this link to login: ${data.loginUrl}<p>`,
        };
        
        let info = await transporter.sendMail(mailOptions);
        console.log(info);
        console.log("Message sent: %s", info.messageId);
        return true;
    
    } catch (error) {
        console.log(error);
        return false
    }

}

sendWelcomeEmail(mailOptionsData);

//output from info:
/* 
 * {
  accepted: [ 'test1@neoscrum.com' ],
  rejected: [],
  envelopeTime: 910,
  messageTime: 615,
  messageSize: 666,
  response: '250 2.0.0 OK  1628848175 y16sm1736571pfp.92 - gsmtp',
  envelope: { from: '', to: [ 'test1@neoscrum.com' ] },
  messageId: '<f7c9eeea-0542-114d-760d-1bebdeb07057@neosoft>'
} 
*/