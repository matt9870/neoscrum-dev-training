const express = require('express');
require('./db/mongoose');
const feedbackCronJob = require('./cron/feedbackForms.cron');
const cors = require('cors');
const multer = require('multer');

//Importing Routes
const userRouter = require('./routers/user.router');
const feedbackRouter = require('./routers/feedback.router');

const app = express();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(feedbackRouter);
app.use("/images", express.static('images'))

app.use(function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
        return res.status(418).send({message: 'File is too large or needs to be in jpg/png/jpeg format'});
    }
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

//Enabling the cron jobs
feedbackCronJob.start();

app.get('/', (req, res) => {
    res.send('Homepage');
})

module.exports = app;