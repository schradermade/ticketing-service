import request from 'supertest';
import { app } from '../../app';
import { createHexObjectId } from '../../test/utils';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = createHexObjectId()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'Modified title',
      price: 25
    })
    .expect(404);
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = createHexObjectId()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Modified title',
      price: 25
    })
    .expect(401);
})

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'Test title2',
      price: 23
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'New title2',
      price: 19
    })
    .expect(401);
})

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.getAuthCookie();
  
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test title 3',
      price: 23
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 23
    })
    .expect(400);
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Valid Title',
      price: -23
    })
    .expect(400);
})

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.getAuthCookie();
  const title = 'Valid title 5';
  const price = 5;
  
  // create the ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test title 3',
      price: 23
    })

  // edit the ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)

    

})

it('publishes an event', async () => {
  const cookie = global.getAuthCookie();
  const title = 'Valid title 5';
  const price = 5;
  
  // create the ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test title 3',
      price: 23
    })

  // edit the ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})