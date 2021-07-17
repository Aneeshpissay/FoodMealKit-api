var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
  description: {
      type: String,
      required: true
  },
  commentImage: {
      type: String
  }
});

module.exports = mongoose.model('Comment', CommentSchema);