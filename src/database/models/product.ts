import mongoose, { Model, Schema, model } from 'mongoose';
import { IProduct } from '../../interfaces';

const productSchema = new Schema({
  name:      { type: String, required: true },
  payment:   { type: String, required: true,
               enum: {
                values: ['cash', 'nequi', 'bancolombia', 'daviplata'],
                message: '{VALUE} no es un medio de pago válido',
                default: 'cash',
                required: true
               }
             },
  amount:    { type: Number, required: true },
  status:   { type: String,
              enum: {
                values: ['active', 'inactive'],
                message: '{VALUE} no es un estado válido',
                default: 'active',
                required: true
              }
            }
}, {
  versionKey: false
});

const Product: Model<IProduct> = mongoose.models.Product || model<IProduct>('Product', productSchema);

export default Product;
