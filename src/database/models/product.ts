import mongoose, { Model, Schema, model } from 'mongoose';
import { IProduct } from '../../interfaces';

const productSchema = new Schema({
  name:   { type: String, required: true },
  cost:   { type: Number, required: true },
  price:  { type: Number, required: true },
  status: { type: String,
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
