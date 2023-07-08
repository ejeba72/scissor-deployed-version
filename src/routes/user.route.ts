import { Router } from "express";
import { deleteUserLogic, loginLogic, logoutLogic, signupLogic, } from "../controllers/user.controller";
import { verifyJwtToken } from "../middleware/auth.middleware";

const router = Router();

router.post('/', loginLogic);
router.post('/signup', signupLogic);
router.get('/logout', logoutLogic);
router.delete('/delete', verifyJwtToken, deleteUserLogic);
// router.delete('/delete', deleteUserLogic);

export { router as userRoute };