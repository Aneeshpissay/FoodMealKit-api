var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FruitsSchema = new Schema({
  name: {
      type: String,
  },
  icon: {
      type: String
  }
});

module.exports = mongoose.model('Fruit', FruitsSchema);