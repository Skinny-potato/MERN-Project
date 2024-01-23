const Errorhandler = require("../Utils/errorhandler");
const catchasynerrors = require("./catchasynerrors");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModels");


exports.isAuthenticatedUse = catchasynerrors(async (req, res, next) => {


    const { token } = req.cookies;
    if (!token) {
        return next(new Errorhandler("Please login to access this website", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});


exports.authoriseRoles = (...roles) => {
    return (req, res, next) => { //this array will have the role of the user 
        if (!roles.includes(req.user.role)) { //this condition is to check the admin role ie if the array contains the admin role then it skips to next else the below condition is passed
            return next(new Errorhandler(`Role : ${req.user.role} is not allowed to access this resource`, 403)
            )
        };
        next();
    };
}