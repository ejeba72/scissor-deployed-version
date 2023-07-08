// This route is for dev purpose only

import { Router } from "express";
import { getReq, getUserReq, postReq } from "../controllers/dev.controller";

const router: Router = Router();

router.get('/', getReq);
router.post('/', postReq);
router.get('/user/:email', getUserReq);

export { router as devRoute};