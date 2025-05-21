import { mongoose, Schema } from "mongoose";

const vaultSchema = new Schema({
    passwords: [{
        type: Schema.Types.ObjectId,
        ref: "SavedPassword"
    }]
}, { timestamps: true })

export const Vault = mongoose.model("Vault",vaultSchema)
