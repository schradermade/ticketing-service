import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tickets-market/common';

import { deleteOrderRouter } from './routes/patch';
import { indexOrderRouter } from './routes/index';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';


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
app.use(currentUser);


app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

// catches any method/route not found and throws error
app.all('*', async (req, res) => {
  throw new NotFoundError()
});

app.use(errorHandler)

export { app};
