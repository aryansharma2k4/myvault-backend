import { SavedPassword } from "../models/savedPassword.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addKeyValue = asyncHandler(async(req, res) => {
    const { key, value } = req.body;
    if([key, value].some((fields) => fields.trim() === "")){
        throw new ApiError(400, "Please Provide complete Password or Application details")
    }
    const newKeyValue = await SavedPassword.create({
        key,
        value
    })

    if(!newKeyValue){
        throw new ApiError(500, "Error saving the password")
    }
    return res.status(200).json(
        new ApiResponse(200, newKeyValue, "Password Saved Successfully")
    )
})

const deleteKeyValue = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const deleted = SavedPassword.findByIdAndDelete(id);
    if(!deleted){
        throw new ApiError(404, "Value not found")
    }
    return res.status(200).json(new ApiResponse(200, {}, "Password Deleted Successfully"))
})



export { addKeyValue, deleteKeyValue }