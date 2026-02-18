import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    nom: string;
    gouvernerat: string;
    ville: string;
    adresse: string;
    cp: string;
    tel: string;
    tel2?: string;
    designation: string;
    nb_article: number;
    msg: string;
    prix: number;
    echange: number; // 0 or 1
    article?: string;
    nb_echange?: number;
    open: number; // 0 or 1

    // API Response Fields
    code_tracking?: string;
    status_api?: number; // 1 success, 0 error
    status_message?: string;
    lien_bl?: string;

    // Internal Fields
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Returned' | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    nom: { type: String, required: true },
    gouvernerat: { type: String, required: true },
    ville: { type: String, required: true },
    adresse: { type: String, required: true },
    cp: { type: String, required: true },
    tel: { type: String, required: true },
    tel2: { type: String },
    designation: { type: String, required: true },
    nb_article: { type: Number, required: true, default: 1 },
    msg: { type: String },
    prix: { type: Number, required: true },
    echange: { type: Number, default: 0 },
    article: { type: String },
    nb_echange: { type: Number },
    open: { type: Number, default: 0 },

    code_tracking: { type: String },
    status_api: { type: Number },
    status_message: { type: String },
    lien_bl: { type: String },

    status: { type: String, default: 'Pending' },
}, { timestamps: true });

// Prevent overwrite model error
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
