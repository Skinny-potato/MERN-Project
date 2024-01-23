const mongoose = require("mongoose");
const valiadator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");//inbuild module


const userSchema = new mongoose.Schema({//to create an user 
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [30, "Name cannot excces 30 characters"],
        minlength: [4, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [valiadator.isEmail, "Please enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [8, "Password should be greater than 8 charcters"],
        select: false //while using the find() method in the database to find a specified data find() method would show all the characters hence by using select false we can stop this 
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,

});


userSchema.pre("save", async function (next) {//this is done to encrypt the password so that even the admin dosent have the access to it 
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)

})//Note that the arrow function is not used as this cant be used in arrow function 


//JWT token 
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });//-->with this key one can access your account and create many fake accounts


};

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password);

}

//Generating password reset token 
userSchema.methods.getResetPasswordToken = function () {
    //Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding to resetPasswordToken to userSchema 
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");


    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

}
module.exports = mongoose.model("User", userSchema);
