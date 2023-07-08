"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcrypt_1 = require("bcrypt");
const mongoose_1 = require("mongoose");
;
;
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield (0, bcrypt_1.genSalt)();
        this.password = yield (0, bcrypt_1.hash)(this.password, salt);
        next();
    });
});
UserSchema.static('authenticate', function authenticate(emailOrUsername, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Find out if user exist in database.
        // 2. If so, compare password received from client with password stored in DB.
        const existingUser = yield this.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
        if (!existingUser)
            throw Error('Invalid email (or username) and password');
        const comparePasswords = yield (0, bcrypt_1.compare)(password, existingUser.password);
        if (!comparePasswords)
            throw Error('Invalid email (or username) and password');
        return existingUser;
    });
});
const UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.UserModel = UserModel;
// BEHIND THE SCENES
/* ******************************************************************************************* */
// UserSchema.static('authenticate', async function authenticate(email: string, username: string, password: string): Promise<IUserSchema> {
//     // 1. Find out if user exist in database.
//     // 2. If so, compare password received from client with password stored in DB.
//     // const findWithEmail = (await this.find({ email }))[0];  // i.e. await this.findOne({ email })
//     // const findWithUsername = (await this.find({ username }))[0];
//     // const existingUser = findWithEmail || findWithUsername;
//     // const existingUser = await this.findOne({ $or: [{ email }, { username }] });
//     const existingUser = (await this.find({ $or: [{ email }, { username }] }))[0];
//     if (!existingUser) throw Error('Invalid email (or username) and password');
//     const comparePasswords = await compare(password, existingUser.password);
//     if (!comparePasswords) throw Error('Invalid email (or username) and password');
//     return existingUser;
// });
/* ******************************************************************************************* */
// import { compare, genSalt, hash } from "bcrypt";
// import { Document, Model, Schema, model } from "mongoose";
// interface IUser extends Document {
//     firstName: string;
//     lastName: string;
//     email: string;
//     username: string;
//     password: string;
// };
// const userSchema: Schema<IUser> = new Schema<IUser>({
//     firstName: 'string',
//     lastName: 'string',
//     email: 'string',
//     username: 'string',
//     password: 'string',
// });
// userSchema.pre('save', async function (next) {
//     const salt = await genSalt();
//     this.password = await hash(this.password, salt);
//     next();
// })
// userSchema.methods.authenticateUser = async function(password: string) {
//     // Compare password received from client with password stored in DB.
//     const comparePasswords = await compare(password, this.password);
//     if (comparePasswords) return true;
//     return false;
// };
// // userSchema.statics.login = async function (email: string, username: string, password: string): Promise<IUser> {
// //     // 1. Find out if user exist in database.
// //     // 2. If so, compare password received from client with password stored in DB.
// //     const findWithEmail = (await this.find({ email }))[0];  // i.e. await this.findOne({ email })
// //     const findWithUsername = (await this.find({ username }))[0];
// //     const existingUser = findWithEmail || findWithUsername;
// //     if (!existingUser) throw Error('Invalid email (or username) and password');
// //     const comparePasswords = await compare(password, existingUser.password);
// //     if (!comparePasswords) throw Error('Invalid email (or username) and password');
// //     return existingUser;
// // };
// const UserModel: Model<IUser> = model<IUser>('User', userSchema);
// export { UserModel };
/* ****************************************************************************** */
// interface IUser extends Document {
//     firstName: string;
//     lastName: string;
//     email: string;
//     username: string;
//     password: string;
// };
// const userSchema: Schema<IUser> = new Schema<IUser>({
//     firstName: 'string',
//     lastName: 'string',
//     email: 'string',
//     username: 'string',
//     password: 'string',
// });
// const UserModel: Model<IUser> = model<IUser>('User', userSchema);
// export { UserModel };
/* ****************************************************************************** */
// import { Schema, model } from 'mongoose';
// import { z } from 'zod';
// const ZUserSchema = z.object({
//     firstName: z.string(),
//     lastName: z.string(),
//     email: z.string(),
//     username: z.string(),
//     password: z.string(),
// });
// const userSchema = new Schema(ZUserSchema.shape);
// const UserModel = model('User', userSchema);
// export { UserModel };
/* ****************************************************************************** */
// const userSchema: Schema<z.infer<typeof ZUserSchema>> = new Schema(ZUserSchema.shape,);
// const userSchema = new Schema(ZUserSchema.shape,);
// type UserType = z.infer<typeof ZUserSchema>;
// const userSchema: Schema<UserType> = new Schema<UserType>(ZUserSchema.shape);
// interface IUser {
//     firstName: string;
//     lastName: string;
//     email: string;
//     username: string;
//     password: string;
// }
// const userSchema: <IUser> = new Schema({})
