import { verify } from "jsonwebtoken";

function generateUserId(jwtToken: any, jwtSecret: any) {
    // if (!(jwtToken && jwtSecret)) return console.log(`User ID cannot be determined`);
    if (!(jwtToken && jwtSecret)) return '';
    const decodedToken = verify(jwtToken, jwtSecret);
    return (decodedToken as any)?.id;
}

export { generateUserId };