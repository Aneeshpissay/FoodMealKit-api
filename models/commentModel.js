var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CommentSchema = new Schema({
  description: {
      type: String,
      required: true
  },
  commentImage: {
      type: String
  },
  author: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: {
        type: String
    },
    phone: {
        type: String
    }
  }
}, {timestamps: true});

module.exports = mongoose.model('Comment', CommentSchema);