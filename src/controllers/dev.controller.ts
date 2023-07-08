// This controller is for development purpose only

import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';

function getReq(req: Request, res: Response): void {
    try {
        console.log({ "successfulGetReq": "A Get request was made to the '/dev' route." });
        res.status(200).send({ getReqPayload: "Your test Get request is successful!" });

    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message);
            res.status(500).send({ errMsg: 'Internal Server Error' });
        } else {
            console.log(err);
            res.status(500).send({ errMsg: 'Internal Server Error' });
        }
    }
}

function postReq(req: Request, res: Response): void {
    try {
        const payload = req.body;
        console.log({ payload });
        res.status(201).send({ payload });

    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message);
            res.status(500).send({ errMsg: 'Interrnal Server Error' });
        } else {
            console.log(err);
            res.status(500).send({ errMsg: 'Internal Server Error' });
        }
    }
}

async function getUserReq(req: Request, res: Response) {
try {
    // const email = 'caleb';
    `
    "_id": "6484c6d62b5101e4038ab03d",
    "_id": "6484c6d62b5101e4038ab03d",
    "_id": "6484c6d62b5101e4038ab03d",
    `

    const { email } = req.params;

    console.log({ reqParams: req.params });
    console.log({ email });

    const user = (await UserModel.find({ email }))[0];
    // const user = users[0];
    // const user = await UserModel.find();
    // const user = await UserModel.findOne({ email });
    
    console.log(user);
    res.status(200).json(user);
} catch (err: unknown) {
    if (err instanceof Error) {
        console.log(err.message);
        res.status(500).json(err.message);
    }
    console.log(err);
    res.status(500).json(err);
}
}

export { getReq, postReq, getUserReq };