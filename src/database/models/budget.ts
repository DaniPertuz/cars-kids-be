import mongoose, { Model, Schema, model } from 'mongoose';
import { IBudget } from '../../interfaces';

const budgetSchema = new Schema({
  base:     { type: Number, required: true, default: 0 },
  expenses: { type: Number, required: true, default: 0 },
  loans:    { type: Number, required: true, default: 0 },
  date:     { type: Date, required: true }
}, {
  versionKey: false
});

const Budget: Model<IBudget> = mongoose.models.Budget || model<IBudget>('Budget', budgetSchema);

export default Budget;
