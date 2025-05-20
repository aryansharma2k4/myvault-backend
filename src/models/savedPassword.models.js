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

savedPasswordsSchema.pre("save",async function (save) {
    if(!this.isModified("value")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

export const SavedPassword = mongoose.model("SavedPassword", savedPasswordsSchema)