var Orders = require('../models/ordersModel');
var jwt = require('jsonwebtoken');
var User = require('../models/userModel');
const { generatePDF } = require('../util/generatePDF');
const { getHtmlContent } = require('../util/orderUtil');

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

exports.downloadOrderInvoice = async (req, res) => {
    const id = req.params.orderId;
    const orders = await Orders.findById(id);
    const htmlContent = await getHtmlContent(orders);
    const pdf = await generatePDF(`<head>
            <style>
                .invoice-text {
                    color: #ffa300;
                    font-weight: bold;
                }
                .invoice-box {
                    max-width: 800px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #eee;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                    font-size: 16px;
                    line-height: 24px;
                    font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                    color: #555;
                    background-color: #e9e9e9;
                }
    
                .invoice-box table {
                    width: 100%;
                    line-height: inherit;
                    text-align: left;
                }
    
                .invoice-box table td {
                    padding: 5px;
                    vertical-align: top;
                }
    
                .invoice-box table tr td:nth-child(2) {
                    text-align: right;
                }
    
                .invoice-box table tr.top table td {
                    padding-bottom: 20px;
                }
    
                .invoice-box table tr.top table td.title {
                    font-size: 45px;
                    line-height: 45px;
                    color: #333;
                }
    
                .invoice-box table tr.information table td {
                    padding-bottom: 40px;
                }
    
                .invoice-box table tr.heading td {
                    background: #eee;
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                }
    
                .invoice-box table tr.details td {
                    padding-bottom: 20px;
                }
    
                .invoice-box table tr.item td {
                    border-bottom: 1px solid #eee;
                }
    
                .invoice-box table tr.item.last td {
                    border-bottom: none;
                }
    
                .invoice-box table tr.total td:nth-child(2) {
                    border-top: 2px solid #eee;
                    font-weight: bold;
                }
                .invoice-box.rtl {
                    direction: rtl;
                    font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                }
    
                .invoice-box.rtl table {
                    text-align: right;
                }
    
                .invoice-box.rtl table tr td:nth-child(2) {
                    text-align: left;
                }
            </style>
        </head>
        <body>
        ${htmlContent}
        </body>`);
    res.set("Content-Type", "application/pdf");
    res.send(pdf);
}