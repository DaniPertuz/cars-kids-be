import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  JWT_SEED: env.get('JWT_SEED').required().asString(),
  MONGO_URL: env.get('MONGO_URL').required().asString(),
  PORT: env.get('PORT').required().asPortNumber(),
  PUBLIC_PATH: env.get('PUBLIC_PATH').required().asString()
};
