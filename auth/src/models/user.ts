import mongoose from "mongoose";

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

export { User };