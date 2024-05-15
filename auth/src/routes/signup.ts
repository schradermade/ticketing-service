import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken'
import { validateRequest } from '../middlewares/validate-request';

import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
],
validateRequest,
async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new BadRequestError('Email is in use')
  }

  const user = User.build({
    email,
    password
  });
  await user.save();

  // Generate JWT
  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
    // exclamation tells typescript to ignore
    // type error, we already checked for JWT_KEY
    // in index.ts file
  }, process.env.JWT_KEY!
);

  // Store it on session object
  // session object will be turned into a string by cookie-session
  // cookie-session middelware will then attempt to send cookie
  // back to users browser inside reponse
  req.session = {
    jwt: userJwt
  }

  res.status(201).send(user);
})

export { router as signupRouter };