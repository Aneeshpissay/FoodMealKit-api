var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var VegetablesSchema = new Schema({
  name: {
      type: String,
  },
  icon: {
      type: String
  }
});

module.exports = mongoose.model('Vegetable', VegetablesSchema);