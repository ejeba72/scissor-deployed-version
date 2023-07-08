"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const connect_db_1 = require("./db/connect.db");
const dev_route_1 = require("./routes/dev.route");
const url_route_1 = require("./routes/url.route");
const redirect_route_1 = require("./routes/redirect.route");
const user_route_1 = require("./routes/user.route");
const scissor_route_1 = require("./routes/scissor.route");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const path_1 = require("path");
const serve_favicon_1 = __importDefault(require("serve-favicon"));
(0, dotenv_1.config)();
(0, connect_db_1.mongodb)();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const apiV1 = '/api/v1';
const faviconPath = (0, path_1.join)(__dirname, '..', 'public', 'favicon.ico');
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 100,
    message: `The frequency of requests from this IP address is overwhelming! Please try again later.`
});
app.set('view engine', 'ejs');
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static('public'));
app.use((0, serve_favicon_1.default)(faviconPath));
app.use(limiter);
app.get('*', auth_middleware_1.checkUser);
app.use(redirect_route_1.redirectRoute);
app.use(`/scissor`, scissor_route_1.scissorRoute);
app.use(`${apiV1}`, url_route_1.urlRoute);
app.use(`${apiV1}/dev`, dev_route_1.devRoute); // for dev purpose only
app.use(`${apiV1}/user`, user_route_1.userRoute);
app.listen(PORT, () => {
    console.log(`Server is attentively listening for incoming requests @ http://127.0.0.1:${PORT}`);
});
