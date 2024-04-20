import mongoose, { Model, Schema, model } from 'mongoose';
import { IUser } from '../../interfaces';

const userSchema = new Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  img:      { type: String, required: false, default: '' },
  password: { type: String, required: true },
  status:   { type: String,
              enum: {
                values: ['active', 'inactive'],
                message: '{VALUE} no es un estado válido',
                default: 'active',
                required: true
              }
            },
  role:     { type: String,
              enum: {
                values: ['admin', 'editor'],
                message: '{VALUE} no es un rol válido',
                default: 'editor',
                required: true
              }
            }
}, {
  timestamps: true,
  versionKey: false
});

const User: Model<IUser> = mongoose.models.User || model<IUser>('User', userSchema);

export default User;
