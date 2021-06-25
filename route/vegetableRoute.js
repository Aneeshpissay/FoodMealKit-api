var vegetableHandlers = require('../controllers/vegetableController');

module.exports = (app) => {
    app.route('/vegetables')
        .get( vegetableHandlers.getVegetable);
}