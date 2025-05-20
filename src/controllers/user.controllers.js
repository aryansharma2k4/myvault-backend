import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    const { fullName, email, password } = req.body;
    if([fullName, email, password].some((field) => field?.trim() === '')){
        throw new ApiError(400, "All fields are required")
    }
    const exsistingUser = await User.findOne({
        $or: [{email}]
    })
    if(exsistingUser){
        throw new ApiError(409, "User already exsists with the current email")
    }

    //create the user
    const user = await User.create({
        fullName,
        email,
        password
    });

    const { accessToken } = await generateAccessAndRefreshTokens(user._id)
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "Error creating User")
    } 
    return res.status(201).json(
        new ApiResponse(200, {user: createdUser, accessToken }, "User resgistered successfully")
    )
});


export {
    registerUser
}