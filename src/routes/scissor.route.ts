import { Router } from "express";
import { clientErrorPage, homepage, loginPage, serverErrorPage, signupPage, success } from "../controllers/scissor.controller";

const router = Router();
router.get('/homepage', homepage);
router.get('/success', success);
router.get('/404-page', clientErrorPage);
router.get('/500-page', serverErrorPage);
router.get('/signup', signupPage);
router.get('/login', loginPage);

export { router as scissorRoute };