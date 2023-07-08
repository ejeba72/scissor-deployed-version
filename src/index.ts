import express, { Application } from 'express';
import { config } from 'dotenv';
import { mongodb } from './db/connect.db';
import { devRoute } from './routes/dev.route';
import { urlRoute } from './routes/url.route';
import { redirectRoute } from './routes/redirect.route';
import { userRoute } from './routes/user.route';
import { scissorRoute } from './routes/scissor.route';
import cookieParser from 'cookie-parser';
import { checkUser } from './middleware/auth.middleware';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { join } from 'path';
import serveFavicon from 'serve-favicon';

config();
mongodb();

const app: Application = express();
const PORT: string | undefined = process.env.PORT;
const apiV1: string = '/api/v1';
const faviconPath = join(__dirname, '..', 'public', 'favicon.ico');
const limiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute window
    max: 100,  // Each IP is limited to 100 requests per window period
    message:  `The frequency of requests from this IP address is overwhelming! Please try again later.`
})

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(serveFavicon(faviconPath));
app.use(limiter);
app.get('*', checkUser);
app.use(redirectRoute);
app.use(`/scissor`, scissorRoute);
app.use(`${apiV1}`, urlRoute);
app.use(`${apiV1}/dev`, devRoute);  // for dev purpose only
app.use(`${apiV1}/user`, userRoute); 

app.listen(PORT, (): void => {
    console.log(`Server is attentively listening for incoming requests @ http://127.0.0.1:${PORT}`);
});