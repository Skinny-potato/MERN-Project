//calling all the modules and functions 

const app = require("./app")

// const dotenv = require("dotenv")
const connectDatabase = require("./config/database")
const cloudinary = require("cloudinary");

//handling uncaught exception eg console.log(youtube)
process.on("uncaughtException", err => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to un caught Exception");
    process.exit(1)
})


//config
if(process.env.NODE_ENV!=="production"){
    // heroku has its own way of getting config file -- so we dont need 
    require("dotenv").config({ path: "backend/config/config.env" })
}


//connecting to database//////////remember that the data base function is called after configration file is called else the function would never find the database
connectDatabase()

// connecting the cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started!! Click on http://localhost:${process.env.PORT}`);
})


//unhandled promise rejection eg: writing something in place of maongodb in the server
process.on("unhandledRejection", err => {
    console.log(`Error : ${err}`);
    console.log("Shutting down the server due to unhandled rejection");

    server.close(() => {
        process.exit(1);
    })
})  