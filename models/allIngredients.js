var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AllIngredientsSchema = new Schema({
  name: {
      type: String,
  },
  icon: {
      type: String
  }
});

module.exports = mongoose.model('Allingredient', AllIngredientsSchema);