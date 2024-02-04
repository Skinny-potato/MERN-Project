const express = require("express")
const app = express();
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
// const dotenv = require("dotenv")
const path =require("path")

//Cors issue 
const cors = require('cors');
const corsOptions ={
    origin: ['http://localhost:3000', 'https://superb-valkyrie-79002c.netlify.app/']
}
app.use(cors(corsOptions));


//config
if(process.env.NODE_ENV!=="production"){
    // heroku has its own way of getting config file -- so we dont need 
    require("dotenv").config({ path: "backend/config/config.env" })
}



app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }))

//Route imports 
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoute")
const payment = require("./routes/paymentRoute")

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

//to host static files 
// app.use(express.static(...)) for serving static files:
// app.get("*", ...) for handling client-side routing:
// app.use(express.static(path.join(__dirname+"../../frontend/build")))
// app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(__dirname+"../../frontend/build/index.html"))
// })

//middleware for error
app.use(errorMiddleware);
module.exports = app