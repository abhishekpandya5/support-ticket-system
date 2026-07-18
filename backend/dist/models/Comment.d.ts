import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from 'mongoose';
declare const commentSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    collection: string;
}, {
    ticketId: mongoose.Types.ObjectId;
    message: string;
    createdBy: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    ticketId: mongoose.Types.ObjectId;
    message: string;
    createdBy: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "collection" | "timestamps"> & {
    timestamps: true;
    collection: string;
}> & Omit<{
    ticketId: mongoose.Types.ObjectId;
    message: string;
    createdBy: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
    ticketId: mongoose.Types.ObjectId;
    message: string;
    createdBy: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export type IComment = InferSchemaType<typeof commentSchema>;
export type CommentDocument = HydratedDocument<IComment>;
export type CommentModel = Model<IComment>;
export declare const Comment: CommentModel;
export {};
//# sourceMappingURL=Comment.d.ts.map