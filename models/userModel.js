var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AddressSchema = new Schema({
  fullname: {
    type: String
  },
  phone: {
    type: String
  },
  pincode: {
    type: Number
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  houseno: {
    type: String
  },
  roadname: {
    type: String
  },
  area: {
    type: String
  },
  landmark: {
    type: String
  },
});

const PhotoSchema = new Schema({
  uri: String,
  filename: String,
  type: String,
  size: Number
});

var UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true
  },
  phone: {
    type: String,
    unique: true
  },
  address: [AddressSchema],
  photo: PhotoSchema,
  role: {
    type: String,
    default: 'user'
  }
});

module.exports = mongoose.model('User', UserSchema);