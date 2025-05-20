import mongoose from "mongoose";

const connectDB = async () => {
    const DB_NAME = 'myvault'
    try{
        const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log('\nMonngo DB Connected');
        
    }catch(err){
        console.error(err)
        console.log('MongoDB connection failed')
        process.exit(1)
    }
}

export default connectDB