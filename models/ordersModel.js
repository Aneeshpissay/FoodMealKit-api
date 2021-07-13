var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ItemSchema = new Schema({
    title: {
        type: String
    },
    servings: {
        type: Number
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    }
});

var OrdersSchema = new Schema({
  orderId: {
    type: Number
  },
  item: [ItemSchema],
  status: {
      type: String,
      default: 'Ordered'
  },
  paymentMode: {
      type: String
  },
  transactionId: {
      type: String
  },
  author: {
      _id: {
          type: String
      },
      username: {
          type: String
      },
      phone: {
          type: String
      }
  }
}, {timestamps: true});

module.exports = mongoose.model('Order', OrdersSchema);