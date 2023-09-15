import mongoose from 'mongoose';

const { Schema } = mongoose;

class User {
  constructor() {
    this.schema = new Schema({
      first_name: String,
      last_name: String,
      email: { type: String, unique: true },
      password: String,
      salt: String,
      created_at: { type: Date, default: Date.now},
      updated_at: { type: Date, default: Date.now},
      schema_version: Number,
    });
  }
}

const User = mongoose.model('User', User.schema);    

export default User;
