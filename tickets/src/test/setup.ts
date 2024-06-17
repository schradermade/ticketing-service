import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createHexObjectId } from './utils';

declare global {
  var getAuthCookie: () => string[];
}

jest.mock('../nats-wrapper')

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

global.getAuthCookie = () => {
  // build a JWT payload. { id, email }
  const payload = {
    id: createHexObjectId(),
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
