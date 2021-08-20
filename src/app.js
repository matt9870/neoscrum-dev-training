const express = require('express');
require('./db/mongoose');
const feedbackCronJob = require('./cron/feedbackForms.cron');
const cors = require('cors');

//Importing Routes
const userRouter = require('./routers/user.router');
const feedbackRouter = require('./routers/feedback.router');

const app = express();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(feedbackRouter);
app.use("/images",express.static('images'))

//Enabling the cron jobs
feedbackCronJob.start();

app.get('/', (req, res) => {
    res.send('Homepage');
})

module.exports = app;