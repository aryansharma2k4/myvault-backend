import dotenv from "dotenv"
import connectDB from "../src/db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(8000, () => {
        console.log('Server is running at PORT 8000');
    })
})
.catch((err) => {
    console.log("Server running failed MongoDB connection failed");
    
})



