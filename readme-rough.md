asyn function getRedirect(req, res) {
        // NOTE: TRANSFER THESE COMMENTS TO THE README/DOCUMENTATION
        // Attempt to retrive... ...check the cache if the route (or shorturl) of the incoming request is an existing key in the cache.
        // if true (i.e. if cache hit), parse the value of such key, and use it as the argument (ie longUrl) for a redirect.
        // otherwise (ie if cache miss), ...attempt to retrieve... ...check the db if there is any document that has the route (or shorturl) of the incoming request.
        // save such shortUrl and longUrl as key-value pairs in cache.
        // use the longUrl to redirect the client with status code 302.
        // if false, return a 404 and the following message: "that short url doesn't exist, create a new short url for your the url you wish to shorten."
}

url.model.ts
/*
- Analytics:
Scissor provides basic analytics that allow users to track their shortened URL's performance. Users can see how many clicks their shortened URL has received and where the clicks are coming from. We need to track when a URL is used.
==> GOALS:
1. Number of clicks
2. Sources of clicks
3. When a Url is used
*/