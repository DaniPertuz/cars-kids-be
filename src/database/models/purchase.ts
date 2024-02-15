import mongoose, { Model, Schema, model } from 'mongoose';
import { IPurchase } from '../../interfaces';

const purchaseSchema = new Schema({
  product:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:     { type: Number, required: true },
  price:        { type: Number, required: true },
  purchaseDate: { type: Date, required: true }
}, {
  versionKey: false
});

const Purchase: Model<IPurchase> = mongoose.models.Purchase || model<IPurchase>('Purchase', purchaseSchema);

export default Purchase;
