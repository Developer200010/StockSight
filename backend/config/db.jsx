const mongoose = require("mongoose");

const connectDB = async() =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/portfolio-tracker")
        console.log("MongoDB is connected");
    } catch (error) {
        console.log("DB connection failed ", error.message)
    }
}

module.exports = connectDB;