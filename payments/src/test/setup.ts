import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { createHexObjectId } from './utils';

declare global {
  var getAuthCookie: (id?: string) => string[];
}

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51N5dqERMtLr79GesKbARIXIU2ht6ZdQbW7PwqmApe04AqPWT7ROaKZ3PyKerKq8KfFFlr9ScSrIHPmJTex8jKNw500R2La9zTr';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'awsdfwef'
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
})

global.getAuthCookie = (id?: string) => {
  // build a JWT payload. { id, email }
  const payload = {
    id: createHexObjectId(id),
    email: 'test@test.com'
  }
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object { jwt: MY_JWT }
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string that is the cookie with the encoded data
  return [`session=${base64}`];
}
