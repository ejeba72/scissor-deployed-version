import { Router } from "express";
import { verifyJwtToken } from "../middleware/auth.middleware";
import {
  deleteQrcodeImages,
  deleteUrl,
  getDashboard,
  postNewShortUrl,
  updateUrl,
} from "../controllers/url.controller";

const router = Router();
router.use("/", verifyJwtToken);
router.route("/")
  .get(getDashboard)
  .post(postNewShortUrl);
router.route("/deleteQrcodeImg")
  .delete(deleteQrcodeImages);
router.route("/delete")
  .delete(deleteUrl);
router.route("/update")
  .put(updateUrl);

export { router as urlRoute };
