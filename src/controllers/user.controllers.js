import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Vault } from "../models/vault.model.js";


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
    const passwords = []
    const userVault = await Vault.create({
        passwords
    })
    if(!userVault){
        throw new ApiError(500, "Error creating vault")
    }

    //create the user
    const user = await User.create({
        fullName,
        email,
        password,
        vault: userVault._id
    });


    const { accessToken } = await generateAccessAndRefreshTokens(user._id)
    const createdUser = await User.findById(user._id).select("-password -refreshToken").populate("vault")
    if(!createdUser){
        throw new ApiError(500, "Error creating User")
    } 
    

    return res.status(201).json(
        new ApiResponse(200, {user: createdUser, accessToken }, "User resgistered successfully")
    )
});

const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    if([email, password].some((field) => field?.trim() === '')){
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findOne({
        $or: [{email}]
    })

    if(!user){
        throw new ApiError(404, "User not found Please check you email id")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Password is Wrong! Please check it")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: "production"
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{
            user: loggedInUser,
            accessToken,
            refreshToken
        }, "User logged in successfully")
    )
})


const logoutUser = asyncHandler(async (req, res) =>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset: {
            refreshToken: 1
        }
    },
    {
        new: true
    }
   )
   const options = {
    httpOnly: true,
    secure: false
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))

})

const checkToken = asyncHandler(async(req, res) => {
    return res.status(200).json(
        new ApiResponse(200, "Token Is Correct")
    )
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRSH_TOKEN_SECRET
        )
    
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError("User not found || Invalid refresh Token")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token in expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }

})

const getUser = asyncHandler(async( req, res) => {
    const { id } = req.params;
    if(id === ''){
        throw new ApiError(400, "Provide a proper ID of the user")
    }
    const user = await User.findById(id);
    if(!user){
        throw new ApiError(409, "Unable to find that user please provider a proper id")
    }
    return res.status(200).json(
        new ApiResponse(200, user, "User fetched Successfully")
    )
})






export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUser,
    checkToken
}