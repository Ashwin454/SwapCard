const app=require("./app");
const dotenv=require("dotenv");
const { connectDB } = require("./config/database");

dotenv.config({path: "./backend/config/config.env"});

connectDB();

app.listen(9000 , ()=>{
    console.log(`Server is UP.`);
});

