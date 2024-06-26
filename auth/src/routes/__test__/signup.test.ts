import request from "supertest";
import { app } from "../../app";

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
})

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalidEmailHere',
      password: 'password'
    })
    .expect(400)
})

it('returns a 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'e'
    })
    .expect(400)
})

it('returns a 400 with missing email and password', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'validEmail@test.com',
    password: ''
  })
  .expect(400)
  await request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: 'validPassword'
    })
    .expect(400)
})

it('disallows duplicate emails', async () => {
  // original signup
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'validPassword'
    })
    .expect(201)
  // duplicate signup
  await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'validPassword'
  })
  .expect(400)
})

it('sets a cookie after successful signup', async () => {
  // with supertest, this entire call will return the 'response'
  const response = await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'validPassword'
  })
  .expect(201)

expect(response.get('Set-Cookie')).toBeDefined();
})