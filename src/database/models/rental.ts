import mongoose, { Model, Schema, model } from 'mongoose';
import { IRental } from '../../interfaces';

const rentalSchema = new Schema({
  client:    { type: String, required: true, default: 'NN' },
  time:      { type: Number, required: true },
  date:      { type: Date, required: true },
  vehicle:   { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  payment:   { type: String,
               enum: {
                values: ['cash', 'nequi', 'bancolombia', 'daviplata'],
                message: '{VALUE} no es un medio de pago válido',
                default: 'cash',
                required: true
               }
             },
  amount:    { type: Number, required: true },
  exception: { type: String, required: false }
}, {
  versionKey: false
});

const Rental: Model<IRental> = mongoose.models.Rental || model<IRental>('Rental', rentalSchema);

export default Rental;
