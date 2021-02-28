const { checkIsEmpty } = require("./authMethods");

const checkSignupInputIsEmpty = (req, res, next) => {
    let errorObj = {};

    const { firstName, lastName, email, password } = req.body;

    if (checkIsEmpty(firstName)) {
        errorObj.firstName = "First Name cannot be empty";
    }

    if (checkIsEmpty(lastName)) {
        errorObj.lastName = "Last Name cannot be empty";
    }

    if (checkIsEmpty(email)) {
        errorObj.email = "email cannot be empty";
    }

    if (checkIsEmpty(password)) { 
        errorObj.password = "password cannot be empty";
    }
    if (Object.keys(errorObj).length > 0) {
        res.render("sign-up", { error: errorObj, });

        // res.status(500).json({
        //     message: "Error",
        //     data: errorObj,
        // })
    } else{
    // it means go to the next function.
    next();
    }
}


module.exports = {
    checkSignupInputIsEmpty,
};