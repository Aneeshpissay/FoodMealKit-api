var orderHandlers = require('../controllers/ordersController');

module.exports = (app) => {
    app.route('/postOrders')
        .post( orderHandlers.postOrders );
    app.route('/orders')
        .get( orderHandlers.getOrders );
}