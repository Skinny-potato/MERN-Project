const mongoose = require("mongoose")




const connectDatabase = () => {
    // ======>the link here used is done coz we want it to be hosted on local host when we use it online we need to use a variable so the below line is used
    // mongoose.connect(process.env.localDB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
        console.log(`Mongo is connected to the server : ${data.connection.host}`);
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

}

module.exports = connectDatabase