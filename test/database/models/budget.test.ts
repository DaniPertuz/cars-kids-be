import { connect, disconnect } from '../../../src/database';
import { BudgetModel } from '../../../src/database/models';

describe('Budget model', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  test('should return BudgetModel', async () => {
    const budgetData = {
      base: 100000,
      expenses: 0,
      loans: 0,
      date: new Date()
    };

    const budget = await BudgetModel.create(budgetData);

    expect(budget.toJSON()).toEqual(expect.objectContaining(budgetData));

    await BudgetModel.findOneAndDelete({ name: budget.base });
  });

  test('should return the schema object', () => {
    const expectedSchema = {
      base: { type: Number, required: true, default: 0 },
      expenses: { type: Number, required: true, default: 0 },
      loans: { type: Number, required: true, default: 0 },
      date: { type: Date, required: true }
    };

    const schema = BudgetModel.schema.obj;

    expect(schema).toEqual(expect.objectContaining(expectedSchema));
  });
});
