import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from 'mongoose';
declare const ticketSchema: Schema<any, Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    collection: string;
}, {
    title: string;
    description: string;
    priority: "critical" | "high" | "low" | "medium";
    status: "cancelled" | "closed" | "in_progress" | "open" | "resolved";
    assignedTo?: mongoose.Types.ObjectId | null;
    createdBy: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    title: string;
    description: string;
    priority: "critical" | "high" | "low" | "medium";
    status: "cancelled" | "closed" | "in_progress" | "open" | "resolved";
    assignedTo?: mongoose.Types.ObjectId | null;
    createdBy: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "collection" | "timestamps"> & {
    timestamps: true;
    collection: string;
}> & Omit<{
    title: string;
    description: string;
    priority: "critical" | "high" | "low" | "medium";
    status: "cancelled" | "closed" | "in_progress" | "open" | "resolved";
    assignedTo?: mongoose.Types.ObjectId | null;
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
    title: string;
    description: string;
    priority: "critical" | "high" | "low" | "medium";
    status: "cancelled" | "closed" | "in_progress" | "open" | "resolved";
    assignedTo?: mongoose.Types.ObjectId | null;
    createdBy: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export type ITicket = InferSchemaType<typeof ticketSchema>;
export type TicketDocument = HydratedDocument<ITicket>;
export type TicketModel = Model<ITicket>;
export declare const Ticket: TicketModel;
export {};
//# sourceMappingURL=Ticket.d.ts.map