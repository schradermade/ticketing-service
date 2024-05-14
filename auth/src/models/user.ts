import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model will have
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface the describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
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

// anytime we save Document to database we  
// will execute callback function 
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done()
})

// how to add a fn to a model in mongoose
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

// feed schema into mongoose, mongoose will create new model out of it
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };