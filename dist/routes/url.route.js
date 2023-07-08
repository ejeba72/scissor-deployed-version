"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const url_controller_1 = require("../controllers/url.controller");
const router = (0, express_1.Router)();
exports.urlRoute = router;
router.use("/", auth_middleware_1.verifyJwtToken);
router.route("/")
    .get(url_controller_1.getDashboard)
    .post(url_controller_1.postNewShortUrl);
router.route("/deleteQrcodeImg")
    .delete(url_controller_1.deleteQrcodeImages);
router.route("/delete")
    .delete(url_controller_1.deleteUrl);
router.route("/update")
    .put(url_controller_1.updateUrl);
