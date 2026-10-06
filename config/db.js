const mongoose = require('mongoose');
const connectDB = async () => {
    try{
        const connn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${connn.connection.host}`);
    }
    catch(error){
        console.log(`Database Connection error: ${error.message}`);
        process.exit(1);
        
    }
}

module.exports = connectDB;