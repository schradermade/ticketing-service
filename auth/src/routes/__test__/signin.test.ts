import request from 'supertest';
import { app } from '../../app';

it('returns 201 upon valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testing@testing.com',
      password: 'testing123'
    })
    .expect(201)
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'testing@testing.com',
      password: 'testing123'
    })
    .expect(201)
  
  expect(response.get('Set-Cookie')).toBeDefined();
})

it('fails and returns 400 if email does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'doesNotExist@testing.com',
      password: 'testing123'
    })
    .expect(400)
})

it('fails and returns 400 if password is incorrect', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testing@testing.com',
      password: 'testing123'
    })
    .expect(201)
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'testing@testing.com',
      password: 'wrongPassword'
    })
    .expect(400)
})