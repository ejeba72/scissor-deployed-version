import { config } from 'dotenv';
import { Request, Response } from 'express';
import { UrlModel } from '../models/url.model';
import { Redis } from 'ioredis';

config();
const REDIS_URI = process.env.REDIS_URI;
const redis = new Redis(REDIS_URI);

// @route GET /
// @desc redirects from '/' to '/scissor/homepage' (i.e the homepage)
async function homepageRedirect(req: Request, res: Response) {
    try {
        res.status(302).redirect(`http://${req.get('host')}/scissor/homepage`);
    } catch (err: unknown) {
        res.status(500).render('500-page');
        if (err instanceof Error) return console.log(err.message);
        return console.log(err);
    }
}

// @route GET /:id
// @desc redirects from short url to long url
async function getRedirect(req: Request, res: Response): Promise<void>  {
    try {
        const { url } = req;
        console.log({url});
        const shortUrl = req.get('host') + url;
        async function analytics(doc: any): Promise<void> {
            doc.clicks += 1;
            doc.clickDetails.push({
                timestamp: new Date(),
                referrer: req.headers.referer,
                userAgent: req.headers['user-agent'],
            });
            await doc.save();
        }
        let LongUrl: string | null = await redis.get(shortUrl);
        if (LongUrl) {
            let cachedLongUrl: string = LongUrl as string;
            cachedLongUrl = JSON.parse(cachedLongUrl);
            console.log({ cachedLongUrl, 'source' : 'cache' });
            res.status(302).redirect(cachedLongUrl);
            const urlDocument = await UrlModel.findOne({ shortUrl });
            analytics(urlDocument);
            return;
        }
        const urlDocument = await UrlModel.findOne({ shortUrl });
        if (urlDocument) {
            const dbLongUrl = urlDocument.longUrl;
            await redis.set(shortUrl, JSON.stringify(dbLongUrl));
            console.log({ dbLongUrl, 'source' : 'database' });
            res.status(302).redirect(dbLongUrl);
            analytics(urlDocument);
        } else {
            res.status(404).render('short-url-error');
        }
    } catch (err: unknown) {
        res.status(500).render('500-page');
        if (err instanceof Error) {
            console.log(err.message);
        } else {
            console.log(err);
        }
    }
}

export { getRedirect, homepageRedirect };