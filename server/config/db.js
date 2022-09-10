const mongoose = require('mongoose');

const connectDB = async () => {
   const conn =  await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
   console.log(`MongoDB connected successfully`.cyan.underline)
}

module.exports = connectDB;       