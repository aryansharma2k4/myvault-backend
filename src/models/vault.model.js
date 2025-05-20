import { mongo, Schema } from "mongoose";

const vaultSchema = new Schema({
    totalPasswords: {
        type: Number,
        required: true
    },
    strongPasswords: {
        type: Number,
        required: true,
    },
    mediumPasswords: {
        type: Number,
        required: true,
    },
    passwords: [{
        type: Schema.Types.ObjectId,
        ref: "SavedPassword"
    }]
}, { timestamps: true })

export const Vault = new mongoose.model("Vault",vaultSchema)

