const{ matches, isStrongPassword } = require("validator");
const { checkForSymbol, checkIsEmail } = require("./methodAuth");
function checkIfHaveNumber(target) {
    if (matches(target, /[0-9]/g)) {
        return true;
    } else {
        return false;
    }
};
function signupLogicDataType(req, res, next) {
    let errorObj = {}; 
    const { firstName, lastName, email, password } = req.body;
    if (checkIfHaveNumber(firstName)) {
        errorObj.firstName = "first name cannot contain numbers";
    }
    if (checkIfHaveNumber(lastName)) {
        errorObj.lastName = "last name cannot contain numbers";
    }
    if (checkForSymbol(firstName)) {
        errorObj.firstName = "first name cant contain numbers or special characters."
    }
    if (checkForSymbol(lastName)) {
        errorObj.lastName = "last name cant contain numbers or special characters."
    }
    if (!isStrongPassword(password)) {
        errorObj.password = 
            "Please enter a valid password. More than 8 characters long."
    }
    if (!checkIsEmail(email)) {
        errorObj.email = "please enter a valid email";
    } 
    if (Object.keys(errorObj).length > 0) {
        res.render("sign-up", { error: errorObj });
        // res.status(500).json({
        //     message: "Error",
        //     data: errorObj,
        // })
    } else {
        next()
    }
}
module.exports = {
    signupLogicDataType,
}