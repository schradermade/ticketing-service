import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { PasswordManager } from '../services/password-manager';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // pull email and pass from body
    const { email, password } = req.body;

    // see if user with email exists, return it to
    // existingUser if exists
    const existingUser = await User.findOne({ email });
    // if no existingUser, throw error
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    // check if supplied and stored passwords match
    const passwordsMatch = await PasswordManager.compare(existingUser.password, password);
    // if they don't match, throw error
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // User is now consdiered to be logged in
    // Send them JWT in a cookie
    // Generate JWT
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
    // exclamation tells typescript to ignore
    // type error, we already checked for JWT_KEY
    // in index.ts file
  }, process.env.JWT_KEY!
);

  
  // Store it on session object
  req.session = {
    jwt: userJwt
  }

  res.status(201).send(existingUser);
  }
)

export { router as signinRouter };