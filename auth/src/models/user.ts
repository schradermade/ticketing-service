import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// schema - tell mongoose about all props user will have
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// feed schema into mongoose, mongoose will create new model out of it
const User = mongoose.model('User', userSchema);

// wraps new User constructor in order to tie in typescript
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

export { User, buildUser };