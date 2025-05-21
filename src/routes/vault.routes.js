import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addPasswordToVault, getVaultById } from "../controllers/vault.controller.js";

const router = Router();

router.route("/:id").get(verifyJWT, getVaultById)
router.route("/add/:vaultId/:passwordId").post(verifyJWT, addPasswordToVault)

export default router