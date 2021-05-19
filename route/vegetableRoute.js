const { verifyToken } = require('../authenticate');
var vegetableHandlers = require('../controllers/vegetableController');

module.exports = (app) => {
    app.route('/vegetables')
        .get( verifyToken ,vegetableHandlers.getVegetable);
}