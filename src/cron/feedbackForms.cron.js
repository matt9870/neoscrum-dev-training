const cron = require('cron').CronJob;
const feedbackController = require('../controllers/feedback.controller');

//creating cron job
const feedbackJob = new cron(`4 14 * * 5`, () => {
    console.log(`adding feedbackforms to each user`);
    feedbackController.addFeedbackForms();
})

// cron format - (seconds   minutes     hour   day(month)   month   day(week))
/**add /* for every occurrance
eg: (/*5 10 * * *) - run a cron job every 5 seconds of 10th min in an hour for every hour&day
*/
module.exports = feedbackJob;