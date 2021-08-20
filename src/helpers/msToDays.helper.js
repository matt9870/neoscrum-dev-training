
module.exports = function millisecToDays(ms){
    let secs = Math.round(ms/1000);
    let minutes = Math.round(secs/60);
    let hours = Math.round(minutes/60);
    let days = Math.round(hours/24);
    let weeks = Math.round(days/7);
    let months = Math.round(days/30);
    let years = Math.round(days/365);
    if(weeks>=1){
        return `${weeks} weeks ago`;
    }
    else if(days>=1){
        return `${days} days ago`;
    }
    else if(hours>=1){
        return `${hours} hours ago`;
    }
    else if(minutes>=1){
        return `${minutes} minutes ago`;
    }
    else if(secs>=1){
        return `${secs} minutes ago`;
    }
};