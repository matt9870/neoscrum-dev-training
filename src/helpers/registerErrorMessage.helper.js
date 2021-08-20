const getMessage = (msg) => {
    const dupName = /dev_name/;
    const dupEmail = /dev_email/;
    let dupNameStatus = dupName.test(msg.toLowerCase());
    let dupEmailStatus = dupEmail.test(msg.toLowerCase());
    if (dupNameStatus) {
        return ('Username taken!')
    }
    else if (dupEmailStatus) {
        return ('Email already used or invalid')
    }
}

module.exports = getMessage;