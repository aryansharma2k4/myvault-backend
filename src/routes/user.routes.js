import { Router } from "express";
import { checkToken, getUser, loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/registerUser").post(registerUser)
router.route("/loginUser").post(loginUser)
router.route("/logoutUser").post(verifyJWT, logoutUser)
router.route("/check").get(verifyJWT, checkToken)
router.route("/:id").get(verifyJWT, getUser)


export default router