import mongoose, { Model, Schema, model } from 'mongoose';
import { IVehicle } from '../../interfaces';

const vehicleSchema = new Schema({
  nickname: { type: String, required: true, unique: true },
  img:      { type: String, required: false, default: '' },
  category: { type: String, required: true },
  color:    { type: String, required: true },
  size:     { type: String,
              enum: {
                values: ['S', 'M', 'L'],
                message: '{VALUE} no es un tamaño válido',
                default: 'M',
                required: true
              }
            },
  status:   { type: String,
              enum: {
                values: ['active', 'inactive'],
                message: '{VALUE} no es un estado válido',
                default: 'active',
                required: true
              }
            }
}, {
  timestamps: true,
  versionKey: false
});

const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;
