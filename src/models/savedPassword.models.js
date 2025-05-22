import mongoose, { mongo, Schema } from "mongoose";
import bcrypt from "bcrypt"

const savedPasswordsSchema = new Schema({
    key: {
        type: String, 
        required: true,
    },
    value: {
        type: String,
        required: true
    }
}, { timestamps: true })




export const SavedPassword = mongoose.model("SavedPassword", savedPasswordsSchema)