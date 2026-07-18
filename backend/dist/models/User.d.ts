import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from 'mongoose';
declare const userSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    collection: string;
}, {
    name: string;
    email: string;
    role: "admin" | "agent" | "viewer";
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    role: "admin" | "agent" | "viewer";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "collection" | "timestamps"> & {
    timestamps: true;
    collection: string;
}> & Omit<{
    name: string;
    email: string;
    role: "admin" | "agent" | "viewer";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    name: string;
    email: string;
    role: "admin" | "agent" | "viewer";
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export type IUser = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<IUser>;
export type UserModel = Model<IUser>;
export declare const User: UserModel;
export {};
//# sourceMappingURL=User.d.ts.map