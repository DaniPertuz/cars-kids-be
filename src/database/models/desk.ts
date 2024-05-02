import mongoose, { Model, Schema, model } from 'mongoose';
import { IDesk } from '../../interfaces';

const deskSchema = new Schema({
  name: { type: String, required: true, unique: true }
}, {
  versionKey: false
});

const Desk: Model<IDesk> = mongoose.models.Desk || model<IDesk>('Desk', deskSchema);

export default Desk;
