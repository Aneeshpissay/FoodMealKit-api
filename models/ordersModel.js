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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: {
          type: String
      },
      phone: {
          type: String
      },
      email: {
        type: String
      }
  },
  address: AddressSchema,
  deliveredDate: {
      type: Date
  },
  paid: {
      type: Boolean,
      default: false
  }
}, {timestamps: true});

module.exports = mongoose.model('Order', OrdersSchema);