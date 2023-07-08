import { Document, Model, Schema, model } from "mongoose";

interface IUrlSchema extends Document {
    longUrl: string;
    shortUrl: string;
    qrcodeFileLocation: string;
    userId: string;
    qrcodeRequested: boolean;
    clicks: number;
    clickDetails: {
      timestamp: Date;
      referrer: string;
      userAgent: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
};
const UrlSchema: Schema<IUrlSchema> = new Schema<IUrlSchema>(
    {
        longUrl: 'string',
        shortUrl: 'string',
        qrcodeFileLocation: 'string',
        userId: {
            type: 'string',
            required: true,
        },
        qrcodeRequested: 'boolean',
        clicks: {
            type: 'number',
            default: 0,
        },
        clickDetails: [
            {
              timestamp: { type: Date, default: Date.now },
              referrer: 'string',
              userAgent: 'string',
            },
        ],
    },
    { timestamps: true }
);
const UrlModel: Model<IUrlSchema> = model<IUrlSchema>('Url', UrlSchema);

export { UrlModel };