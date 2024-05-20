import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@tickets-market/common';

const app = express();
// reason for this is traffic is being proxied to our
// application through Ingress nginx
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  // cookies only shared when req made over https connection
  // this equality check allows for supertest to receive cookie
  //   if test environment by setting secure=false
  secure: process.env.NODE_ENV !== 'test'
}))

// catches any route paths not found and throws error
app.all('*', async (req, res) => {
  throw new NotFoundError()
});

app.use(errorHandler)

export { app};
