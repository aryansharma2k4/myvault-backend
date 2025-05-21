import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addKeyValue, deleteKeyValue, editKeyValue } from "../controllers/savedPasswords.controllers.js";

const router = Router();

router.route("/add").post(verifyJWT,addKeyValue)
router.route("/delete/:id").post(verifyJWT, deleteKeyValue)
router.route("/edit/:id").post(verifyJWT, editKeyValue)


export default router;