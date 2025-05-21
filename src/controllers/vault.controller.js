import { Vault } from "../models/vault.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVaultById = asyncHandler(async( req, res) => {
    const { id } = req.params;
    if(id === ''){
        throw new ApiError(400, "Provide a proper ID")
    }

    const vault = await Vault.findById(id)
    if(!vault) {
        throw new ApiError(404, "Unable to find a vault with that ID")
    }
    return res.status(200).json(
        new ApiResponse(200, vault, "Vault found successfully")
    )
})

const addPasswordToVault = asyncHandler(async (req, res) => {
    const { vaultId } = req.params;
    const { passwordId } = req.params;

    if(!vaultId || !passwordId){
        throw new ApiError(404, "Please provide a proper password")
    }

    const vault = await Vault.findById(vaultId)
    if(!vault){
        throw new ApiError(404, "Unable to find the requested vault")
    }
    const exsistingPassword = await vault.passwords.includes(passwordId);
    if(exsistingPassword){
        throw new ApiError(408, "Password already exsist in the vault")
    }
    await vault.passwords.push(passwordId)
    await vault.save()

    const updatedVault = await Vault.findById(vaultId).populate("passwords")

    if(!updatedVault){
        throw new ApiError(405, "Unable to update the vault")
    }
    return res.status(200).json(
        new ApiResponse(200, vault, "Password added to the vault successfully")
    )

    
})

export { getVaultById, addPasswordToVault }
