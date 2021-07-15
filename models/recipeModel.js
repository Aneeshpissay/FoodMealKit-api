var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var IngredientSchema = new Schema({
    name: {
        type: String,
    },
    quantity: {
      type: String,
    },
    measurement: {
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
  category: {
    type: String
  },
  servings: {
    type: Number
  },
  cookTime: {
    type: String,
    required: true
  },
  ingredients: [IngredientSchema],
  price: {
    type: String,
    required: true
  },
  preparation: [{
      method: {
          type: String
      },
      stepImage: [{
        type: String
      }]
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  published: {
      type: Boolean,
      default: false
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

module.exports = mongoose.model('Recipe', RecipeSchema);