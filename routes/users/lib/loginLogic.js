const { checkIsEmpty, checkIsEmail } = require("./methodAuth.js");
function loginLogicEmptyMiddleware (req, res, next){
    let errorObj = {};
    let checkedEmail = false;
    const { email, password } = req.body;
    if (checkIsEmpty(email)) {
        errorObj.email = "Email cannot be empty";
        checkedEmail = true;
    } 
    if (checkIsEmpty(password)) {
        errorObj.password = "Password cannot be empty";
    }
    if (!checkedEmail) {
        if (!checkIsEmail(email)) {
            errorObj.email = "It must be in email format!";
        }
    }
    if (Object.keys(errorObj).length > 0) {
        res.render("login", { error: errorObj });
    } else {
        next()
    }
}
module.exports = {
    loginLogicEmptyMiddleware,
}