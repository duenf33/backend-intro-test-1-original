const { matches, isEmpty, isEmail } = require("validator");

function checkForSymbol(target) {
    if (matches(target, /[!@#$%^&*()\[\],.?“:{}|<>]/g)) {
        return true;
    } else {
        return false;
    }
}

function checkIsEmpty(target) {
    if (isEmpty(target)) {
        return true;
    } else {
        return false;
    }
}

function checkIsEmail(target) {
    if (isEmail(target)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    checkForSymbol,
    checkIsEmpty,
    checkIsEmail,
};