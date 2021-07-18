var Orders = require('../models/ordersModel');
var jwt = require('jsonwebtoken');
var User = require('../models/userModel');

exports.getOrders = async (req, res) => {
    const usertoken = req.headers['authorization'];
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'RESTFULAPIs');
    const id = decoded._id;
    const user = await User.findById(id);
    const orders = await Orders.find({"author._id": user._id});
    res.json(orders);
}

exports.getOrder =  async (req, res) => {
    const usertoken = req.headers['authorization'];
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'RESTFULAPIs');
    const id = decoded._id;
    const orders = await Orders.find({"item.author._id": id});
    res.json(orders);
}

exports.postOrders = async (req, res) => {
    const usertoken = req.headers['authorization'];
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'RESTFULAPIs');
    const id = decoded._id;
    const user = await User.findById(id);
    const { _id, username, phone } = user;
    const author = {_id: _id, username: username, phone: phone};
    const orders = new Orders(req.body);
    orders.author = author;
    orders.save();
    res.json({success: true});
}

exports.cancelOrder = async (req, res) => {
    const usertoken = req.headers['authorization'];
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'RESTFULAPIs');
    const id = decoded._id;
    const user = await User.findById(id);
    const orders = await Orders.findOne({"author._id": user._id, "_id": req.params.orderid});
    orders.status = 'Cancelled';
    orders.save();
    res.json({success: true});
}

exports.changeStatusOrder = async (req, res) => {
    await Orders.updateMany({"_id" : {$in: req.body.orderIds}}, {$set: {status: req.body.status, paid: req.body.status === 'Delivered' ? true : false}});
    res.json({success: true});
}