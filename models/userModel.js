var mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    unique: true
  },
  auth: {
    type: Boolean,
    default: false
  },
  otp: {
    type: Number
  },
  hash_password: {
    type: String
  }
});

mongoose.model('User', UserSchema);