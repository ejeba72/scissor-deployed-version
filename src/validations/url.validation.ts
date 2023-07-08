import { optional, z } from "zod";

const ZUrlSchema = z.object({
    longUrl: z.string({required_error: `Please enter the url you wish to shorten`}),
    qrcodeRequested: z.boolean(),
    customUrl: z.string().optional(),
    clicks: z.number().default(0).optional(),
    clickDetails: z.array(
      z.object({
        timestamp: z.date().default(() => new Date()).optional(),
        referrer: z.string().optional(),
        userAgent: z.string().optional(),
      })
    ).optional(),
  });

  export { ZUrlSchema };