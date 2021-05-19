var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IngredientSchema = new Schema({
    name: {
        type: String,
    },
    icon: {
        type: String,
    }
})

const FileSchema = new Schema({
    url: String,
    filename: String,
    type: String,
    size: Number
});

var RecipeSchema = new Schema({
  recipeImage: [FileSchema],
  recipeVideo: FileSchema,
  title: {
    type: String,
    required: true
  },
  description: {
      type: String,
      required: true
  },
  ingredients: [IngredientSchema],
  preparation: [{
      stepDescription: {
          type: String
      },
      stepImage: [FileSchema]
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String,
    phone: String
  },
  private: {
      type: Boolean,
      default: true
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);