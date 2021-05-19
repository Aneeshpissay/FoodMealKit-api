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

mongoose.model('Comment', CommentSchema);